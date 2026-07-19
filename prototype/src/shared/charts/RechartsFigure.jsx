import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../components/ui/chart.jsx';
import { payloadToRecharts } from '../../core/charts/payloadToRecharts.js';

export default function RechartsFigure({ doc }) {
  const { data, config, keys, chartType, hlines } = payloadToRecharts(doc);
  if (!data.length || !keys.length) {
    return <p className="text-sm text-muted-foreground">No plottable points (gaps left as gaps).</p>;
  }

  const isPie = chartType === 'pie' || chartType === 'donut';
  const isBar = chartType === 'bar' || chartType === 'grouped_bar' || chartType === 'stacked_bar';
  const stacked = chartType === 'stacked_bar';

  if (isPie) {
    const pieKey = keys[0];
    const pieData = data
      .map((row) => ({ name: row.label, value: row[pieKey], fill: config[pieKey]?.color }))
      .filter((d) => typeof d.value === 'number');

    // Multi-slice pie: prefer first series categorical points as slices
    const slices =
      pieData.length > 1
        ? pieData
        : (doc.series?.[0]?.data || []).map((d, i) => {
            const name = Array.isArray(d) ? String(d[0]) : String(d.x);
            const value = Array.isArray(d) ? d[1] : d.y;
            return {
              name,
              value,
              fill: `var(--chart-${(i % 5) + 1})`,
            };
          }).filter((d) => typeof d.value === 'number');

    const pieConfig = Object.fromEntries(
      slices.map((s, i) => [s.name, { label: s.name, color: `var(--chart-${(i % 5) + 1})` }]),
    );

    return (
      <ChartContainer config={pieConfig} className="mx-auto aspect-square max-h-[260px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            innerRadius={chartType === 'donut' ? 55 : 0}
            strokeWidth={2}
          >
            {slices.map((entry, i) => (
              <Cell key={entry.name} fill={`var(--chart-${(i % 5) + 1})`} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={config} className="aspect-[16/9] w-full min-h-[200px]">
      {isBar ? (
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} width={36} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {keys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={4}
              stackId={stacked ? 'a' : undefined}
            />
          ))}
          {hlines.map((h, i) => (
            <ReferenceLine
              key={i}
              y={h.y}
              stroke={h.color}
              strokeDasharray="4 4"
              label={{ value: h.label, fill: h.color, fontSize: 10 }}
            />
          ))}
        </BarChart>
      ) : (
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} width={36} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {keys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls={false}
            />
          ))}
          {hlines.map((h, i) => (
            <ReferenceLine
              key={i}
              y={h.y}
              stroke={h.color}
              strokeDasharray="4 4"
              label={{ value: h.label, fill: h.color, fontSize: 10 }}
            />
          ))}
        </LineChart>
      )}
    </ChartContainer>
  );
}
