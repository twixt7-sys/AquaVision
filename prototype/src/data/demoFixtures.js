// Hand-written UI fixtures for the Phase 1/2 app demo. Everything here is
// illustrative_synthetic and must be badged as such wherever shown. Deliberately
// contains NO user counts, conversion rates, or banned phrases (see
// elevator-pitches.json#/the_words_never_to_use). Health/disease replies always
// carry a confidence flag and a route to a human, never a diagnosis.

export const PROVENANCE = 'illustrative_synthetic';

// --- AI assistant scripted chat ---
export const assistantChat = [
  { from: 'assistant', text: "Good morning. I'm your AquaVision assistant. What would you like help with: pond setup, a feeding question, or a sick fish?" },
  { from: 'user', text: 'my tilapia are gasping at the surface early in the morning' },
  {
    from: 'assistant',
    text:
      "Surface gasping before dawn is most often low dissolved oxygen: it bottoms out just before sunrise. A few things worth checking this morning: have you fed heavily in the last day, and is the water green/cloudy? If you can, log a DO reading now and again at 5 a.m. tomorrow.",
    disclaimer: 'This is general guidance, not a diagnosis. If fish are dying, treat it as urgent and consider an expert.',
    actions: ['Log a water reading', 'Talk to a human expert'],
  },
  { from: 'user', text: 'water is very green' },
  {
    from: 'assistant',
    text:
      "A heavy algae bloom uses up oxygen overnight, which fits the pre-dawn gasping. Short term, easing off feed and running aeration through the night can help. I can't tell you it's safe or unsafe from here; I don't have a measurement of your water.",
    disclaimer: 'I detect patterns in what you tell me. I do not measure your water and I never confirm it is safe.',
    actions: ['Set an aeration reminder', 'Talk to a human expert'],
  },
];

// --- disease-ID candidates (photo triage; suggestion + confidence + human referral) ---
export const diseaseCandidates = {
  photoCaption: 'Uploaded photo · tilapia, lateral view (sample image)',
  candidates: [
    { name: 'Columnaris (suspected)', confidence: 0.61, note: 'Frayed fins and pale patches are consistent, but so are several other conditions.' },
    { name: 'Streptococcosis', confidence: 0.23, note: 'Cannot be ruled out from a photo; often needs a lab confirmation.' },
    { name: 'Handling / water-quality stress', confidence: 0.16, note: 'Non-infectious causes look similar in images.' },
  ],
  framing:
    "This is a suggestion to help you triage, not a diagnosis. Image tools are easily wrong on photos unlike their training data. When in doubt, consult a vet or extension officer.",
};

// --- feeding schedule ---
export const feedingSchedule = [
  { time: '06:30', pond: 'Pond A · tilapia', amount: '3.2 kg', status: 'done' },
  { time: '11:00', pond: 'Pond A · tilapia', amount: '3.2 kg', status: 'due' },
  { time: '16:00', pond: 'Pond B · milkfish', amount: '2.4 kg', status: 'upcoming' },
];

// --- farmer-logged water readings, WITH GAPS (gaps render as gaps, never interpolated) ---
// [day index, DO mg/L or null for a day not logged]
export const farmerWaterLog = {
  chart_type: 'line',
  title: 'Your dissolved oxygen readings',
  provenance: PROVENANCE,
  axes: {
    x: { label: 'Day', unit: '', type: 'linear', min: 1, max: 14 },
    y: { label: 'Dissolved oxygen', unit: 'mg/L', type: 'linear', min: 0, max: 9 },
  },
  series: [
    {
      name: 'Logged DO (manual, morning) · SYNTHETIC',
      unit: 'mg/L',
      provenance: PROVENANCE,
      data: [
        [1, 6.1], [2, 5.8], [3, null], [4, null], [5, 5.4],
        [6, 4.9], [7, null], [8, 5.2], [9, null], [10, null],
        [11, null], [12, null], [13, null], [14, 4.6],
      ],
    },
  ],
  annotations: [
    { kind: 'band', value: [9, 13], label: 'Nine days without a reading', severity: 'advisory' },
  ],
  notes: 'Manual, farmer-entered. Gaps are real gaps: the days nobody logged. We never draw a line across them.',
};

export const lastLoggedDaysAgo = 9;

// --- pond roster (Home carousel + detail pages) · varied species + statuses ---
// Each pond carries the metadata the detail page renders. All illustrative_synthetic.
export const ponds = [
  {
    id: 'A',
    label: 'Pond A',
    species: 'tilapia',
    speciesLabel: 'Nile tilapia',
    status: 'no_data',
    caption: `${lastLoggedDaysAgo}d since log`,
    areaM2: 1200,
    depthM: 1.6,
    stock: 4800,
    stockedDaysAgo: 74,
    lastReadingMinutes: lastLoggedDaysAgo * 24 * 60,
    water: { do: null, temp: null, ph: null, salinity: 0 },
    feed: { type: 'Floating pellet 32%', dailyKg: 3.2 },
    doTrend: [6.1, 5.8, null, null, 5.4, 4.9, null],
    note: 'Nothing logged in over a week. Grey means unknown, not safe — a reading is overdue here.',
  },
  {
    id: 'B',
    label: 'Pond B',
    species: 'milkfish',
    speciesLabel: 'Milkfish (bangus)',
    status: 'ok',
    caption: '6.1 mg/L DO',
    areaM2: 1800,
    depthM: 2.0,
    stock: 6200,
    stockedDaysAgo: 96,
    lastReadingMinutes: 42,
    water: { do: 6.1, temp: 28.4, ph: 7.8, salinity: 18 },
    feed: { type: 'Floating pellet 28%', dailyKg: 2.4 },
    doTrend: [5.9, 6.0, 6.2, 6.1, 6.3, 6.1, 6.1],
    note: 'Holding in a healthy band. Morning DO is steady and feeding is on schedule.',
  },
  {
    id: 'C',
    label: 'Pond C',
    species: 'crawfish',
    speciesLabel: 'Freshwater prawn',
    status: 'advisory',
    caption: 'DO trending down',
    areaM2: 900,
    depthM: 1.2,
    stock: 15000,
    stockedDaysAgo: 51,
    lastReadingMinutes: 130,
    water: { do: 4.7, temp: 29.6, ph: 7.4, salinity: 2 },
    feed: { type: 'Sinking crumble 35%', dailyKg: 1.1 },
    doTrend: [5.6, 5.4, 5.1, 5.0, 4.9, 4.8, 4.7],
    note: 'Oxygen has slipped for five mornings running. Trending toward the low band — worth watching tonight.',
  },
  {
    id: 'D',
    label: 'Pond D',
    species: 'crab',
    speciesLabel: 'Mud crab',
    status: 'ok',
    caption: '5.8 mg/L DO',
    areaM2: 700,
    depthM: 1.0,
    stock: 2400,
    stockedDaysAgo: 63,
    lastReadingMinutes: 88,
    water: { do: 5.8, temp: 28.9, ph: 7.9, salinity: 24 },
    feed: { type: 'Trash fish + pellet', dailyKg: 1.6 },
    doTrend: [5.7, 5.9, 5.8, 6.0, 5.8, 5.9, 5.8],
    note: 'Brackish pen is stable. Salinity and oxygen both sitting comfortably for mud crab.',
  },
  {
    id: 'E',
    label: 'Pond E',
    species: 'catfish',
    speciesLabel: 'African catfish',
    status: 'warning',
    caption: 'Low DO overnight',
    areaM2: 1000,
    depthM: 1.4,
    stock: 9000,
    stockedDaysAgo: 38,
    lastReadingMinutes: 25,
    water: { do: 3.4, temp: 30.2, ph: 7.1, salinity: 0 },
    feed: { type: 'Floating pellet 32%', dailyKg: 4.5 },
    doTrend: [4.8, 4.4, 4.1, 3.9, 3.7, 3.5, 3.4],
    note: 'Overnight oxygen dropped below the safe band. Catfish tolerate it, but keep aeration on before dawn.',
  },
  {
    id: 'F',
    label: 'Pond F',
    species: 'fry',
    speciesLabel: 'Tilapia fingerlings',
    status: 'ok',
    caption: 'Tilapia fingerlings',
    areaM2: 300,
    depthM: 0.8,
    stock: 22000,
    stockedDaysAgo: 16,
    lastReadingMinutes: 60,
    water: { do: 6.4, temp: 27.8, ph: 7.6, salinity: 0 },
    feed: { type: 'Fry mash / starter', dailyKg: 0.6 },
    doTrend: [6.2, 6.3, 6.5, 6.4, 6.5, 6.4, 6.4],
    note: 'Nursery pond for the next tilapia cycle. Fingerlings are grading well; keep the fine starter feed going.',
  },
];

export function pondById(id) {
  return ponds.find((p) => p.id === id) || null;
}

// --- weather / tide snapshot (Home conditions strip) ---
export const environmentSnapshot = {
  condition: 'partly_cloudy',
  conditionLabel: 'Partly cloudy',
  tempC: 29,
  feelsLikeC: 32,
  humidityPct: 74,
  windKph: 12,
  location: 'Taal Lake · Batangas',
  tide: { label: 'High tide', time: '2:14 PM' },
};

// --- in-app notifications (top-nav bell) ---
export const notifications = [
  {
    id: 'n1',
    tone: 'warning',
    icon: 'do',
    title: 'Pond E — low oxygen overnight',
    body: 'Dissolved oxygen dipped to 3.4 mg/L before dawn. Keep aerators running.',
    when: '18 min ago',
    unread: true,
  },
  {
    id: 'n2',
    tone: 'advisory',
    icon: 'trend',
    title: 'Pond C — DO trending down',
    body: 'Five mornings of falling oxygen. Consider a pre-dawn reading tonight.',
    when: '1 h ago',
    unread: true,
  },
  {
    id: 'n3',
    tone: 'nodata',
    icon: 'clock',
    title: 'Pond A — no reading in 9 days',
    body: 'This pond has gone quiet. Log DO or temperature when you can.',
    when: '3 h ago',
    unread: true,
  },
  {
    id: 'n4',
    tone: 'nominal',
    icon: 'feed',
    title: 'Feeding logged — Pond B',
    body: '2.4 kg floating pellet recorded for the 06:30 feed.',
    when: 'Yesterday',
    unread: false,
  },
  {
    id: 'n5',
    tone: 'community',
    icon: 'community',
    title: 'New reply in Community',
    body: 'Coop San Isidro answered your aeration schedule thread.',
    when: 'Yesterday',
    unread: false,
  },
];

export const unreadNotificationCount = notifications.filter((n) => n.unread).length;

// --- community forum ---
export const forumPosts = [
  { author: 'Marissa L.', when: '2 h ago', title: 'Best time to feed during hot weather?', replies: 7, tag: 'Feeding' },
  { author: 'Ben T.', when: '5 h ago', title: 'Anyone else seeing green water on Taal this week?', replies: 12, tag: 'Water quality' },
  { author: 'Coop San Isidro', when: '1 d ago', title: 'Sharing our aeration schedule that cut morning losses', replies: 20, tag: 'Equipment' },
  { author: 'Rey P.', when: '2 d ago', title: 'First harvest with milkfish: what to expect?', replies: 5, tag: 'Getting started' },
];

// --- learning modules ---
export const learningModules = [
  { title: 'Understanding dissolved oxygen', minutes: 8, progress: 1.0 },
  { title: 'Reading your pond: colour and clarity', minutes: 6, progress: 0.5 },
  { title: 'Feeding without fouling the water', minutes: 10, progress: 0.0 },
  { title: 'Spotting disease early', minutes: 12, progress: 0.0 },
];

// --- marketplace (premium) · take rate visible by design ---
export const marketplaceListings = [
  { item: 'Floating tilapia feed, 25 kg', seller: 'AquaFeed Co.', price: '₱1,180', takeRatePct: 6 },
  { item: 'Paddle-wheel aerator, 1 HP', seller: 'PondTech', price: '₱18,500', takeRatePct: 6 },
  { item: 'Milkfish fingerlings (per 1,000)', seller: 'Batangas Hatchery', price: '₱2,400', takeRatePct: 6 },
  { item: 'Buyer: bulk tilapia, weekly', seller: 'Manila Market Link', price: 'Contact', takeRatePct: 6 },
];

// --- expert consultation thread (premium) ---
export const consultationThread = {
  expert: 'Dr. Aileen R., aquaculture vet',
  booked: 'Tomorrow, 14:00',
  messages: [
    { from: 'user', text: 'Photos attached: some fins look frayed on my tilapia. The app suggested columnaris but flagged low confidence.' },
    { from: 'expert', text: "Thanks. I've seen the disease-ID suggestion and your last two water logs. Let's confirm on the call; in the meantime, avoid handling the affected fish and hold off on the next feed increase." },
  ],
};

// --- predictive-health mechanism sentences (premium) · no bare scores ---
export const predictiveHealthNotes = [
  {
    severity: 'advisory',
    text:
      "You logged dissolved oxygen at 4.9 mg/L on day 6 and haven't logged since. Mornings this warm, oxygen can fall further overnight than a daytime reading shows.",
    basis: 'Based on your own logged readings: 4 entries over 14 days.',
  },
  {
    severity: 'nominal',
    text: 'Feeding has been consistent with your schedule this week. Nothing in your logs suggests a change is needed.',
    basis: 'Based on your feeding log.',
  },
];

// --- recommendations (premium), each stating the data it was based on ---
export const recommendations = [
  { text: 'Consider running aeration overnight until the water clears.', basis: 'Because your last reading was 4.9 mg/L and you reported green water.' },
  { text: 'Log a pre-dawn reading tomorrow if you safely can.', basis: 'Because your readings are all daytime, and the daily minimum is before sunrise.' },
];
