"""AquaVision TAM / SAM / SOM chart — concentric circles + value funnel."""

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch

OUT = Path(__file__).resolve().parent.parent / "exports"
OUT.mkdir(exist_ok=True)

FX = 58.0  # PHP per USD

# --- Values ---
TAM_USD_B = 1.5          # global aquaculture digital software (midpoint USD 1-2B)
TAM_PHP_B = TAM_USD_B * FX

SAM_ACCOUNTS = 70_000    # PH mobile-reachable finfish/shrimp aquafarmers
SAM_PHP_M = SAM_ACCOUNTS * 299 * 12 / 1e6  # full premium monetisation potential

SOM_PAYING = 3_550       # Year 3 paying accounts (premium + enterprise)
SOM_PHP_M = 15.78        # Year 3 revenue P millions

NAVY = "#1B4965"
TEAL = "#2A9D8F"
BLUE = "#457B9D"
LIGHT = "#A8DADC"
CORAL = "#E76F51"
BG = "#F8FAFC"

fig = plt.figure(figsize=(16, 9), dpi=140)
fig.patch.set_facecolor(BG)
fig.suptitle(
    "AquaVision — TAM / SAM / SOM",
    fontsize=18, fontweight="bold", color=NAVY, y=0.97,
)
fig.text(
    0.5, 0.905,
    "Aquaculture management platform · Philippines beachhead · Premium ₱299/mo + Enterprise ₱1,499/mo",
    ha="center", fontsize=10, color="#555",
)

# ---------- Left: concentric circles ----------
ax1 = fig.add_axes([0.03, 0.06, 0.46, 0.80])
ax1.set_xlim(0, 10)
ax1.set_ylim(0, 10)
ax1.set_aspect("equal")
ax1.axis("off")

cx, base_y = 5.0, 1.2
# circles sized visually (not to scale — annotated as such)
circles = [
    (4.2, LIGHT, 0.55),
    (2.6, BLUE, 0.75),
    (1.15, CORAL, 1.0),
]
for r, color, alpha in circles:
    ax1.add_patch(Circle((cx, base_y + r), r, facecolor=color, alpha=alpha,
                         edgecolor=NAVY, linewidth=1.4))

# TAM label
ax1.text(cx, base_y + 4.2 * 2 - 0.55, "TAM", ha="center", fontsize=15,
         fontweight="bold", color=NAVY)
ax1.text(cx, base_y + 4.2 * 2 - 1.25,
         "Global aquaculture digital software\n≈ USD 1–2B / yr  (≈ ₱58–116B)\n"
         "Precision aqua tech: USD 0.85B (MnM 2025)",
         ha="center", fontsize=8.6, color=NAVY)

# SAM label
ax1.text(cx, base_y + 2.6 * 2 - 0.75, "SAM", ha="center", fontsize=13,
         fontweight="bold", color="white")
ax1.text(cx, base_y + 2.6 * 2 - 1.55,
         "PH mobile-reachable finfish/shrimp farmers\n≈ 70,000 accounts  (≈ ₱251M/yr potential)\n"
         "from BFAR FishR 260,961 aquafarmers",
         ha="center", fontsize=8.2, color="white")

# SOM label
ax1.text(cx, base_y + 1.15, "SOM", ha="center", fontsize=11.5,
         fontweight="bold", color="white")
ax1.text(cx, base_y + 0.55,
         "3,550 paying (Y3)\n₱15.8M revenue",
         ha="center", fontsize=7.8, color="white")

ax1.text(cx, 0.25, "Circle sizes illustrative, not to scale",
         ha="center", fontsize=7, color="#888", style="italic")

# ---------- Right: value funnel bars ----------
ax2 = fig.add_axes([0.55, 0.12, 0.41, 0.70])
ax2.set_facecolor(BG)

layers = [
    ("TAM\nGlobal aqua software", TAM_PHP_B * 1000, LIGHT,
     f"₱{TAM_PHP_B:.0f}B / yr   (USD {TAM_USD_B:.1f}B midpoint)"),
    ("SAM\nPH reachable farmers", SAM_PHP_M, BLUE,
     f"₱{SAM_PHP_M:.0f}M / yr potential   (70,000 × ₱299 × 12)"),
    ("SOM\nAquaVision Year 3", SOM_PHP_M, CORAL,
     f"₱{SOM_PHP_M:.1f}M / yr   (3,550 paying = 5.1% of SAM)"),
]

import math
y_pos = [2, 1, 0]
# log-scale widths for visibility
widths = [math.log10(v) for _, v, _, _ in layers]
max_w = max(widths)

for (label, val, color, note), y, w in zip(layers, y_pos, widths):
    ax2.barh(y, w, height=0.62, color=color, edgecolor=NAVY, linewidth=1.2)
    ax2.text(-0.15, y, label, ha="right", va="center", fontsize=10,
             fontweight="bold", color=NAVY)
    ax2.text(w + 0.12, y, note, ha="left", va="center", fontsize=8.6, color="#333")

ax2.set_xlim(0, max_w + 3.4)
ax2.set_ylim(-0.6, 2.7)
ax2.axis("off")
ax2.set_title("Annual value by layer (log-scaled bars, PHP)",
              fontsize=11, color=NAVY, fontweight="bold", pad=14)

# funnel percentages between layers (placed in the vertical gaps between bars)
fig.text(0.755, 0.535, "↓  SAM ≈ 0.3% of global TAM (geography + species + digital filter)",
         fontsize=8, color="#666", ha="center", style="italic")
fig.text(0.755, 0.325, "↓  SOM ≈ 6.3% of SAM value by Year 3 (5.1% of accounts)",
         fontsize=8, color="#666", ha="center", style="italic")

fig.text(
    0.5, 0.015,
    "Sources: FAO SOFIA 2024 (industry context USD 312.8B output — not SaaS TAM) · "
    "MarketsandMarkets Precision Aquaculture (Aug 2025) · BFAR FishR 2023 (260,961 aquafarmers) · "
    "PSA–DICT NICTHS 2024 (mobile access) · AquaVision 3-year model (Y3 SOM)",
    ha="center", fontsize=7.4, color="#777",
)

path = OUT / "AquaVision-TAM-SAM-SOM.png"
fig.savefig(path, bbox_inches="tight", facecolor=fig.get_facecolor())
plt.close()
print(f"Saved: {path} ({path.stat().st_size/1024:.0f} KB)")
