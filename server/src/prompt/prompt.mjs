// server/src/prompt/prompt.mjs
// This module defines the prompt template and the statistical analysis logic for interpreting cow sensor data.

const CATTLE_NORMS = {
  temperature: {
    mean: 38.65, // °C
    sd: 0.33,
    low: 38.0,
    high: 39.3,
    critical_low: 37.5,
    critical_high: 40.5,
    unit: "°C",
  },
  heartbeat: {
    mean: 66, // bpm
    sd: 9,
    low: 48,
    high: 84,
    critical_low: 36,
    critical_high: 100,
    unit: "bpm",
  },
  activity: {
    mean: 55,
    sd: 20,
    low: 20,
    high: 90,
    critical_low: 5,
    critical_high: 100,
    unit: "units",
  },
  methane_level: {
    mean: 120, // ppm — resting healthy cow
    sd: 40,
    low: 0,
    high: 200,
    critical_low: 0,
    critical_high: 500,
    unit: "ppm",
  },
};

// ─── Statistical helpers ──────────────────────────────────────────────────────

const zScore = (value, mean, sd) => ((value - mean) / sd).toFixed(2);

const deviationSeverity = (z) => {
  const abs = Math.abs(z);
  if (abs < 1.0) return "normal";
  if (abs < 1.5) return "mild";
  if (abs < 2.0) return "moderate";
  if (abs < 3.0) return "severe";
  return "critical";
};

const deviationDirection = (value, norm) => {
  if (value > norm.high) return "elevated";
  if (value < norm.low) return "depressed";
  return "normal";
};

const rangePercentile = (value, norm) => {
  const span = norm.high - norm.low;
  return (((value - norm.low) / span) * 100).toFixed(1);
};

const isCritical = (value, norm) =>
  value <= norm.critical_low || value >= norm.critical_high;

// ─── Composite risk scoring ───────────────────────────────────────────────────

const WEIGHTS = {
  temperature: 0.35,
  heartbeat: 0.25,
  activity: 0.2,
  methane_level: 0.2,
};

const paramScore = (absZ) => {
  if (absZ < 1.0) return 0;
  if (absZ < 1.5) return 0.25;
  if (absZ < 2.0) return 0.5;
  if (absZ < 3.0) return 0.75;
  return 1.0;
};

const compositeRiskScore = (stats) => {
  const score = Object.entries(WEIGHTS).reduce((total, [param, weight]) => {
    const absZ = Math.abs(stats[param].zScore);
    return total + paramScore(absZ) * weight * 100;
  }, 0);
  return Math.min(100, score).toFixed(1);
};

// ─── Known disease pattern matching ──────────────────────────────────────────

const DISEASE_PATTERNS = [
  // ── Respiratory ────────────────────────────────────────────────────────────
  {
    name: "Respiratory Infection (Pneumonia / BRD)",
    patterns: {
      temperature: { direction: "elevated", minSeverity: "mild" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },

  // ── Rumen / Digestive ──────────────────────────────────────────────────────
  {
    name: "Bloat (Ruminal Tympany)",
    patterns: {
      temperature: { direction: "normal" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "elevated", minSeverity: "moderate" },
    },
    weight: 1.2, // acutely life-threatening — upweighted
  },
  {
    name: "Acidosis (Ruminal)",
    // Grain overload → excess acid → methanogens suppressed → low methane,
    // elevated HR from pain/toxaemia, very low activity
    patterns: {
      temperature: { direction: "normal" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "moderate" },
      methane_level: { direction: "depressed", minSeverity: "mild" },
    },
    weight: 1.1,
  },
  {
    name: "Hardware Disease (Traumatic Reticuloperitonitis)",
    // Swallowed metal punctures reticulum → peritonitis → grunt on movement,
    // mild fever, elevated HR from pain, severely depressed activity
    patterns: {
      temperature: { direction: "elevated", minSeverity: "mild" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "severe" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },

  // ── Metabolic ──────────────────────────────────────────────────────────────
  {
    name: "Ketosis (Acetonaemia)",
    patterns: {
      temperature: { direction: "depressed", minSeverity: "mild" },
      heartbeat: { direction: "depressed", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "moderate" },
      methane_level: { direction: "depressed", minSeverity: "mild" },
    },
    weight: 1.0,
  },
  {
    name: "Hypocalcaemia (Milk Fever)",
    // Post-calving calcium crash → recumbency, cold extremities,
    // very low HR (bradycardia), very low activity, methane normal (rumen still working)
    patterns: {
      temperature: { direction: "depressed", minSeverity: "mild" },
      heartbeat: { direction: "depressed", minSeverity: "moderate" },
      activity: { direction: "depressed", minSeverity: "severe" },
      methane_level: { direction: "normal" },
    },
    weight: 1.1,
  },
  {
    name: "Hypomagnesaemia (Grass Tetany)",
    // Low magnesium → muscle tremors and agitation before collapse;
    // elevated HR and initially elevated activity (excitable phase)
    patterns: {
      temperature: { direction: "normal" },
      heartbeat: { direction: "elevated", minSeverity: "moderate" },
      activity: { direction: "elevated", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },

  // ── Infectious / Systemic ──────────────────────────────────────────────────
  {
    name: "General Infection / Septicaemia",
    patterns: {
      temperature: { direction: "elevated", minSeverity: "severe" },
      heartbeat: { direction: "elevated", minSeverity: "moderate" },
      activity: { direction: "depressed", minSeverity: "moderate" },
      methane_level: { direction: "any" },
    },
    weight: 1.1,
  },
  {
    name: "Mastitis",
    // Udder infection → systemic fever + HR spike + lethargy;
    // methane normal unless animal is completely off-feed
    patterns: {
      temperature: { direction: "elevated", minSeverity: "mild" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 0.9, // lower confidence without udder palpation data
  },
  {
    name: "Foot-and-Mouth Disease (FMD)",
    // Vesicular lesions → very high fever, extreme reluctance to move (pain),
    // tachycardia from fever/pain, methane normal
    patterns: {
      temperature: { direction: "elevated", minSeverity: "moderate" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "severe" },
      methane_level: { direction: "normal" },
    },
    weight: 1.15,
  },
  {
    name: "Bovine Viral Diarrhoea (BVD)",
    // Mucosal disease → fever, dullness, reduced rumen motility and feed intake
    // → low methane from off-feed; elevated HR from infection
    patterns: {
      temperature: { direction: "elevated", minSeverity: "mild" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "moderate" },
      methane_level: { direction: "depressed", minSeverity: "mild" },
    },
    weight: 1.0,
  },

  // ── Environmental ──────────────────────────────────────────────────────────
  {
    name: "Heat Stress",
    // High ambient temperature → elevated body temp and tachycardia + lethargy;
    // methane often drops because feed intake falls in heat
    patterns: {
      temperature: { direction: "elevated", minSeverity: "moderate" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },
  {
    name: "Hypothermia / Cold Stress",
    // Prolonged cold exposure → shivering then depression,
    // sub-normal temperature, bradycardia, very low activity
    patterns: {
      temperature: { direction: "depressed", minSeverity: "moderate" },
      heartbeat: { direction: "depressed", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "moderate" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },

  // ── Pain / Musculoskeletal ─────────────────────────────────────────────────
  {
    name: "Lameness / Musculoskeletal Pain",
    // Chronic pain → mild tachycardia (pain response), severely reduced movement,
    // normal temperature unless secondary infection, normal methane
    patterns: {
      temperature: { direction: "normal" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "severe" },
      methane_level: { direction: "normal" },
    },
    weight: 0.95,
  },
];

const SEVERITY_RANK = {
  normal: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  critical: 4,
};

const scorePattern = (stats, pattern) => {
  const params = Object.keys(pattern.patterns);
  let matched = 0;

  for (const param of params) {
    const rule = pattern.patterns[param];
    const observed = stats[param];

    const directionMatch =
      rule.direction === "any" ||
      observed.direction === rule.direction ||
      (rule.direction === "normal" && observed.direction === "normal");

    const severityMatch =
      !rule.minSeverity ||
      SEVERITY_RANK[observed.severity] >= SEVERITY_RANK[rule.minSeverity];

    if (directionMatch && severityMatch) matched++;
  }

  return ((matched / params.length) * pattern.weight).toFixed(3);
};

const rankDiseaseMatches = (stats) =>
  DISEASE_PATTERNS.map((d) => ({
    name: d.name,
    matchScore: parseFloat(scorePattern(stats, d)),
  }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // top 3 candidates passed to Groq

// ─── Main stats builder ───────────────────────────────────────────────────────

const buildStats = (temperature, heartbeat, activity, methane_level) => {
  const readings = { temperature, heartbeat, activity, methane_level };

  const stats = {};
  for (const [param, value] of Object.entries(readings)) {
    const norm = CATTLE_NORMS[param];
    const z = parseFloat(zScore(value, norm.mean, norm.sd));
    stats[param] = {
      value,
      unit: norm.unit,
      zScore: z,
      severity: deviationSeverity(z),
      direction: deviationDirection(value, norm),
      rangePercentile: parseFloat(rangePercentile(value, norm)),
      isCritical: isCritical(value, norm),
      referenceRange: `${norm.low}–${norm.high} ${norm.unit}`,
    };
  }

  const riskScore = parseFloat(compositeRiskScore(stats));
  const riskBand = riskScore < 20 ? "Low" : riskScore < 50 ? "Medium" : "High";

  const topMatches = rankDiseaseMatches(stats);

  return { stats, riskScore, riskBand, topMatches };
};

// ─── Prompt generator ─────────────────────────────────────────────────────────

const prompt = (
  temperature,
  heartbeat,
  activity,
  methane_level,
  trendSummary = null,
) => {
  const { stats, riskScore, riskBand, topMatches } = buildStats(
    temperature,
    heartbeat,
    activity,
    methane_level,
  );

  const statLines = Object.entries(stats)
    .map(([param, s]) => {
      const critFlag = s.isCritical ? " ⚠ CRITICAL THRESHOLD BREACHED" : "";
      return `  • ${param.replace("_", " ")}: ${s.value} ${s.unit}
      – Reference range : ${s.referenceRange}
      – Z-score         : ${s.zScore} (${s.severity} deviation, ${s.direction})
      – Range percentile: ${s.rangePercentile}%${critFlag}`;
    })
    .join("\n");

  const matchLines = topMatches
    .map(
      (m, i) =>
        `  ${i + 1}. ${m.name} — pattern match score: ${(m.matchScore * 100).toFixed(1)}%`,
    )
    .join("\n");

  // Only include the trend block if we have history
  const trendBlock = trendSummary
    ? `
════════════════════════════════════════════
  HISTORICAL TREND (previous readings)
════════════════════════════════════════════

${trendSummary}

  Use this to determine if the cow's condition is:
  • Improving  — abnormal values moving back toward normal ranges
  • Stable     — values not changing significantly
  • Worsening  — abnormal values moving further from normal ranges
  A worsening trend on an already-abnormal reading should raise your Risk_Level.
  An improving trend may justify a lower Risk_Level than the snapshot alone suggests.
`
    : `
  (No historical readings available — assessment based on current snapshot only.)
`;

  return `You are a senior cattle veterinarian with 20 years of field experience and deep knowledge of bovine physiology. You are reviewing real-time smart-collar data that has already been statistically processed. Your assessment will be acted on directly by a farmer — precision and clinical honesty matter more than caution.

════════════════════════════════════════════
  PRE-COMPUTED STATISTICAL ANALYSIS
  (single latest collar reading)
════════════════════════════════════════════

${statLines}

  Composite Risk Score : ${riskScore} / 100 (band: ${riskBand})
  (Weighted: temperature 35%, heartbeat 25%, activity 20%, methane 20%)

  Top algorithmic pattern matches (scored against 14 known bovine conditions):
${matchLines}
${trendBlock}
════════════════════════════════════════════
  YOUR CLINICAL TASK
════════════════════════════════════════════

You must reason through the data in three steps before producing output:

STEP 1 — PARAMETER INTERACTION ANALYSIS
  Examine how the four parameters interact, not just in isolation.
  Key interaction signatures to consider:
  • Fever + tachycardia + low activity                  → systemic infection triad
  • High methane + tachycardia + low activity           → rumen bloat / tympany
  • Low temp + bradycardia + very low activity          → metabolic collapse (ketosis / milk fever)
  • High temp + tachycardia + high activity             → heat stress or grass tetany (agitation phase)
  • Very low activity + mild fever + normal methane     → pain-based condition (lameness, FMD, hardware disease)
  • Low methane + tachycardia + low activity            → ruminal acidosis or BVD (off-feed)
  • Critically low temp + bradycardia + very low activity → hypothermia

STEP 2 — VALIDATE OR CHALLENGE THE PATTERN MATCHES
  Do not blindly accept the algorithmic matches.
  Ask: does this combination of z-scores and parameter directions make physiological sense
  for each candidate? If a high-scoring match is implausible given the full picture,
  say so in the reason field. Prefer the most specific diagnosis over a vague one.
  Factor in the trend data — a worsening pattern increases diagnostic confidence.

STEP 3 — ASSIGN RISK AND PRODUCE OUTPUT
  Hard rules you must follow:
  • If ALL parameters are within 1 standard deviation of normal → Risk_Level MUST be "Low".
  • If ANY parameter breaches a critical threshold (marked ⚠ above) → Risk_Level CANNOT be "Low".
  • You may override the algorithmic band (${riskBand}) only if you state a clear clinical reason.
  • "possible_disease" → single most clinically plausible condition given all four parameters together.
  • "differential_diagnosis" → next most plausible; use "None" only if truly no alternative fits.
  • "reason" → must reference at least two specific z-scores or parameter interactions. Two sentences maximum.
  • "recommendation" → numbered, prioritised action steps. No generic advice. Tell the farmer exactly what to do first.

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include numbering like 1., 2., etc.
- Arrays must contain only plain strings
- No markdown, no explanation, no backticks

{
  "Risk_Level": "Low | Medium | High",
  "Composite_Risk_Score": ${riskScore},
  "possible_disease": "Most clinically plausible condition, or 'None detected'",
  "differential_diagnosis": "Second most plausible condition, or 'None'",
  "parameter_flags": {
    "temperature": "${stats.temperature.direction} (${stats.temperature.severity})",
    "heartbeat": "${stats.heartbeat.direction} (${stats.heartbeat.severity})",
    "activity": "${stats.activity.direction} (${stats.activity.severity})",
    "methane_level": "${stats.methane_level.direction} (${stats.methane_level.severity})"
  },
  "reason": "Two sentences maximum. Must cite at least two z-scores or parameter interactions.",
  "recommendation": "Numbered, prioritised action list for the farmer."
}`;
};

export default prompt;
export { buildStats, CATTLE_NORMS };
