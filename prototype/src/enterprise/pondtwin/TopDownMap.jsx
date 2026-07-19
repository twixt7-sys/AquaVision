import { useEffect, useMemo } from 'react';
import { MapContainer, Rectangle, CircleMarker, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildGrid } from '../../app/pondtwin/interpolate.js';
import { geometry, stationStateAt, cageStatuses } from '../../data/twinData.js';
import { normalizeStatus } from '../../shared/components/StatusBadge.jsx';

/** Resolve DO values to paintable hex for Leaflet paths. */
function resolveDoColor(v) {
  if (v == null) return '#8A97A0';
  if (v < 2) return '#C63B2F';
  if (v < 3.5) return '#E2721F';
  if (v < 5) return '#E0A82E';
  return '#2E9E6B';
}

const STATUS_HEX = {
  ok: '#2E9E6B',
  nominal: '#2E9E6B',
  advisory: '#E0A82E',
  warning: '#E2721F',
  critical: '#C63B2F',
  no_data: '#8A97A0',
};

/** Leaflet CRS.Simple: coords are [y, x] in metres over the farm extent. */
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [12, 12] });
  }, [map, bounds]);
  return null;
}

export default function TopDownMap({ hour, layers, selectedCage, onSelectCage }) {
  const { extent_m: ext, cages, dock, stations } = geometry;
  const stationValues = stationStateAt(hour);
  const grid = useMemo(() => buildGrid(geometry, stationValues), [hour]);
  const cageStatus = cageStatuses();

  const bounds = useMemo(
    () => L.latLngBounds([0, 0], [ext.y, ext.x]),
    [ext.x, ext.y],
  );

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <MapContainer
          crs={L.CRS.Simple}
          center={[ext.y / 2, ext.x / 2]}
          zoom={1}
          minZoom={-1}
          maxZoom={4}
          style={{ height: 360, width: '100%' }}
          maxBounds={bounds.pad(0.08)}
          attributionControl={false}
          zoomControl
        >
          <FitBounds bounds={bounds} />

          {/* Water body */}
          <Rectangle
            bounds={[[0, 0], [ext.y, ext.x]]}
            pathOptions={{
              fillColor: '#0B608F',
              fillOpacity: 0.55,
              color: '#043B66',
              weight: 2,
            }}
          />

          {/* Interpolated / confidence field */}
          {(layers.interpolated || layers.confidence) &&
            grid.map((c, i) => {
              const showConf = layers.confidence;
              const fill = showConf ? '#44A7D2' : resolveDoColor(c.value);
              const op = layers.interpolated
                ? 0.18 + c.confidence * 0.55
                : showConf
                  ? 0.14 + c.confidence * 0.7
                  : 0;
              const noise = layers.interpolated && c.confidence < 0.5;
              return (
                <Rectangle
                  key={i}
                  bounds={[
                    [c.y, c.x],
                    [c.y + c.h, c.x + c.w],
                  ]}
                  pathOptions={{
                    fillColor: fill,
                    fillOpacity: noise ? op * 0.55 : op,
                    color: 'transparent',
                    weight: 0,
                    className: noise ? 'twin-uncertain-cell' : undefined,
                  }}
                >
                  {showConf && (
                    <Tooltip permanent direction="center" className="twin-conf-tip">
                      {c.confidence.toFixed(2)}
                    </Tooltip>
                  )}
                </Rectangle>
              );
            })}

          {/* Dock */}
          <Rectangle
            bounds={[
              [dock.y - 4, dock.x - 4],
              [dock.y + 4, dock.x + 4],
            ]}
            pathOptions={{ fillColor: '#EFF2F5', fillOpacity: 0.95, color: '#043B66', weight: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -6]} className="twin-label-tip">
              dock
            </Tooltip>
          </Rectangle>

          {/* Measured stations */}
          {layers.measured &&
            stations.map((s) => (
              <CircleMarker
                key={s.station_id}
                center={[s.y, s.x]}
                radius={7}
                pathOptions={{
                  fillColor: '#FFFFFF',
                  fillOpacity: 1,
                  color: '#043B66',
                  weight: 2,
                }}
              >
                <Tooltip permanent direction="right" offset={[8, 0]} className="twin-label-tip">
                  {s.station_id.replace('SYNTH-', '')}
                </Tooltip>
              </CircleMarker>
            ))}

          {/* Cages */}
          {cages.map((c) => {
            const status = cageStatus.find((cs) => cs.unit_id === c.unit_id)?.status || c.status_illustrative;
            const key = normalizeStatus(status);
            const color = STATUS_HEX[key] || STATUS_HEX.no_data;
            const sel = selectedCage === c.unit_id;
            return (
              <Circle
                key={c.unit_id}
                center={[c.y, c.x]}
                radius={c.radius_m}
                eventHandlers={{ click: () => onSelectCage?.(c.unit_id) }}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.22,
                  color,
                  weight: sel ? 3.5 : 1.8,
                  dashArray: key === 'no_data' ? '6 4' : undefined,
                }}
              >
                <Tooltip permanent direction="center" className="twin-cage-tip">
                  {c.unit_id.replace('SYNTH-', '')}
                  {layers.operator ? ' · ~est.' : ''}
                </Tooltip>
              </Circle>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full border border-[#043B66] bg-white" />
          measured station (sharp)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 bg-accent/50" />
          interpolated (fades with distance)
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-primary/70">
          Leaflet · CRS.Simple · metres
        </span>
        {selectedCage && (
          <span>
            Selected: <b>{selectedCage.replace('SYNTH-', '')}</b> · see the slice →
          </span>
        )}
      </div>

      <style>{`
        .twin-label-tip, .twin-cage-tip, .twin-conf-tip {
          background: rgba(4, 59, 102, 0.88) !important;
          border: none !important;
          color: #EFF2F5 !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          box-shadow: none !important;
        }
        .twin-label-tip::before, .twin-cage-tip::before, .twin-conf-tip::before {
          display: none !important;
        }
        .twin-uncertain-cell {
          filter: url(#uncertain);
        }
      `}</style>
    </div>
  );
}
