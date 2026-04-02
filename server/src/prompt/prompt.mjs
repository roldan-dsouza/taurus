// // server/src/prompt/prompt.mjs

// const prompt = (
//   temperature,
//   heartbeat,
//   activity,
//   methane_level,
// ) => `You are an expert AI veterinary assistant specializing in cattle health. Your task is to analyze real-time sensor data from a cow's smart collar and provide a diagnostic assessment.

// **Normal Reference Ranges for Healthy Cattle:**
// - Body Temperature: 38.0°C – 39.3°C
// - Heart Rate: 48 – 84 bpm (beats per minute)
// - Activity Level: Categorized as "active" (grazing/walking), "resting" (standing/lying), or "low" (unusually still/lethargic)
// - Methane Level (as indicator of bloat/rumen health): Normal < 200 ppm; Elevated 200–500 ppm; High > 500 ppm (risk of bloat)

// **Current Sensor Readings:**
// - Temperature: ${temperature} °C
// - Heartbeat: ${heartbeat} bpm
// - Activity Level: ${activity}
// - Methane Level: ${methane_level} ppm

// **Instructions:**
// 1. Compare each reading against the normal ranges.
// 2. Identify any abnormal values and consider possible combinations that indicate specific conditions (e.g., fever + elevated heart rate + reduced activity → possible infection).
// 3. Consider these common diseases/conditions: Mastitis, Ketosis, Respiratory Infection, Digestive Disorder (including bloat), Heat Stress, or General Infection.
// 4. Assign a risk level (Low, Medium, High) based on severity and urgency.
// 5. Provide a clear reason explaining why you suspect that disease.
// 6. Give practical recommendations for the farmer (e.g., "Check udder for swelling", "Isolate and monitor", "Consult veterinarian immediately").

// **Output Format:**
// Respond **only** with a valid JSON object (no additional text, markdown, or explanation). Use the following structure exactly:

// {
//   "Risk_Level": "Low/Medium/High",
//   "possible_disease": "Name of suspected condition or 'None'",
//   "reason": "Brief explanation based on sensor data",
//   "recommendation": "Actionable advice for the farmer"
// }

// **Examples:**
// - If temperature is 39.8°C, heart rate 95 bpm, activity "low", methane 150 ppm → possible respiratory infection.
// - If methane is 650 ppm, activity "resting", temperature normal → high bloat risk.

// Now, analyze the given data and produce the JSON output.`;
// export default prompt;

// server/src/prompt/prompt.mjs

/**
 * Normal reference ranges for healthy cattle.
 * Each parameter includes mean, standard deviation, and clinical thresholds
 * derived from standard veterinary literature.
 */
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
    // Activity is scored 0–100 by many collar sensors.
    // We treat it as a continuous value for z-score purposes.
    mean: 55,
    sd: 20,
    low: 20, // lethargic threshold
    high: 90, // hyperactive/agitated threshold
    critical_low: 5,
    critical_high: 100,
    unit: "units",
  },
  methane_level: {
    mean: 120, // ppm — resting healthy cow
    sd: 40,
    low: 0,
    high: 200, // elevated starts here
    critical_low: 0,
    critical_high: 500, // bloat risk
    unit: "ppm",
  },
};

// ─── Statistical helpers ──────────────────────────────────────────────────────

/**
 * Compute z-score: how many standard deviations a reading is from the mean.
 * Positive = above mean, negative = below mean.
 */
const zScore = (value, mean, sd) => ((value - mean) / sd).toFixed(2);

/**
 * Classify deviation severity based on z-score magnitude.
 * Returns one of: "normal", "mild", "moderate", "severe", "critical"
 */
const deviationSeverity = (z) => {
  const abs = Math.abs(z);
  if (abs < 1.0) return "normal";
  if (abs < 1.5) return "mild";
  if (abs < 2.0) return "moderate";
  if (abs < 3.0) return "severe";
  return "critical";
};

/**
 * Determine direction of deviation: "elevated", "depressed", or "normal"
 */
const deviationDirection = (value, norm) => {
  if (value > norm.high) return "elevated";
  if (value < norm.low) return "depressed";
  return "normal";
};

/**
 * Express a value as a percentile position within the normal range.
 * Values outside [low, high] will be < 0% or > 100%.
 */
const rangePercentile = (value, norm) => {
  const span = norm.high - norm.low;
  return (((value - norm.low) / span) * 100).toFixed(1);
};

/**
 * Check if value breaches a critical threshold (beyond the abnormal range).
 */
const isCritical = (value, norm) =>
  value <= norm.critical_low || value >= norm.critical_high;

// ─── Composite risk scoring ───────────────────────────────────────────────────

/**
 * Weighted composite risk score (0–100).
 *
 * Weights reflect clinical importance to overall cattle health:
 *   temperature    — 35%  (fever/hypothermia is the strongest infection signal)
 *   heartbeat      — 25%  (circulatory stress indicator)
 *   activity       — 20%  (behavioural change is an early warning sign)
 *   methane_level  — 20%  (bloat/rumen health specific)
 *
 * Each parameter contributes a score of 0–25 (scaled by weight):
 *   |z| < 1   → 0 points (normal)
 *   |z| 1–1.5 → 25% of weight (mild)
 *   |z| 1.5–2 → 50% of weight (moderate)
 *   |z| 2–3   → 75% of weight (severe)
 *   |z| ≥ 3   → 100% of weight (critical)
 */
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

/**
 * Each pattern describes the expected deviation profile for a condition.
 * A "match score" is computed by how closely the readings fit the pattern.
 *
 * direction: "elevated" | "depressed" | "any" | "normal"
 * severity:  minimum severity level to trigger ("mild" | "moderate" | "severe")
 */
const DISEASE_PATTERNS = [
  {
    name: "Respiratory Infection",
    patterns: {
      temperature: { direction: "elevated", minSeverity: "mild" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },
  {
    name: "Bloat (Ruminal Tympany)",
    patterns: {
      temperature: { direction: "normal" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "elevated", minSeverity: "moderate" },
    },
    weight: 1.2, // bloat is acutely dangerous — upweight
  },
  {
    name: "Ketosis",
    patterns: {
      temperature: { direction: "depressed", minSeverity: "mild" },
      heartbeat: { direction: "depressed", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "moderate" },
      methane_level: { direction: "depressed", minSeverity: "mild" },
    },
    weight: 1.0,
  },
  {
    name: "Heat Stress",
    patterns: {
      temperature: { direction: "elevated", minSeverity: "moderate" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 1.0,
  },
  {
    name: "Mastitis",
    patterns: {
      temperature: { direction: "elevated", minSeverity: "mild" },
      heartbeat: { direction: "elevated", minSeverity: "mild" },
      activity: { direction: "depressed", minSeverity: "mild" },
      methane_level: { direction: "normal" },
    },
    weight: 0.9, // similar to respiratory — slightly lower confidence without udder data
  },
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
];

const SEVERITY_RANK = {
  normal: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  critical: 4,
};

/**
 * Score how well the observed stats match a disease pattern (0–1).
 * Each matching parameter adds (1 / total_params) to the score.
 */
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

/**
 * Return the top 2 disease matches sorted by score descending.
 */
const rankDiseaseMatches = (stats) =>
  DISEASE_PATTERNS.map((d) => ({
    name: d.name,
    matchScore: parseFloat(scorePattern(stats, d)),
  }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 2);

// ─── Main stats builder ───────────────────────────────────────────────────────

/**
 * Build a full statistical profile for all four sensor readings.
 * This is the single source of truth passed into the prompt.
 */
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

const prompt = (temperature, heartbeat, activity, methane_level) => {
  const { stats, riskScore, riskBand, topMatches } = buildStats(
    temperature,
    heartbeat,
    activity,
    methane_level,
  );

  // Format per-parameter statistical block for the prompt
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

  return `You are an expert AI veterinary assistant specialising in cattle health monitoring. You will receive pre-computed statistical sensor analysis from a smart collar and must produce a precise clinical assessment.

════════════════════════════════════════════
  PRE-COMPUTED STATISTICAL ANALYSIS
════════════════════════════════════════════

${statLines}

  Composite Risk Score : ${riskScore} / 100 (band: ${riskBand})
  (Weighted: temperature 35%, heartbeat 25%, activity 20%, methane 20%)

  Top pattern-matched conditions (algorithmic, not final diagnosis):
${matchLines}

════════════════════════════════════════════
  YOUR CLINICAL TASK
════════════════════════════════════════════

Using the statistical context above:

1. **Validate or challenge** the pattern-matched conditions using clinical reasoning.
   Do not simply accept them — explain whether the combination of deviations makes
   biological sense for each candidate condition.

2. **Identify interactions** between parameters. For example:
   - Elevated temperature + elevated heart rate + low activity is a fever-infection triad.
   - High methane + depressed activity + normal temperature points to rumen dysfunction.
   - Low temperature + low heart rate + low activity is a metabolic (ketosis/hypocalcaemia) profile.

3. **Assign a final Risk_Level** (Low / Medium / High). You may adjust from the
   algorithmic band (${riskBand}) if clinical reasoning warrants it — but you must
   justify any adjustment in the "reason" field.

4. **Produce only a valid JSON object** with this exact structure:

{
  "Risk_Level": "Low | Medium | High",
  "Composite_Risk_Score": ${riskScore},
  "possible_disease": "Most likely condition, or 'None detected'",
  "differential_diagnosis": "Second most likely condition, or 'None'",
  "parameter_flags": {
    "temperature": "${stats.temperature.direction} (${stats.temperature.severity})",
    "heartbeat": "${stats.heartbeat.direction} (${stats.heartbeat.severity})",
    "activity": "${stats.activity.direction} (${stats.activity.severity})",
    "methane_level": "${stats.methane_level.direction} (${stats.methane_level.severity})"
  },
  "reason": "One-to-two sentence clinical explanation referencing specific z-scores and parameter interactions.",
  "recommendation": "Concrete, prioritised actions for the farmer."
}

Output the JSON only — no markdown, no surrounding text.`;
};

export default prompt;

// ─── Named export for direct use in pre-processing / logging ─────────────────
export { buildStats, CATTLE_NORMS };
