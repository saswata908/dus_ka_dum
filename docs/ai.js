/**
 * DUS KA DUM — AI MODULE
 * ai/ai.js
 *
 * Calls the Anthropic Claude API to simulate inference
 * across all 10 trained social-media ML models and
 * return per-profile predictions + survey percentages.
 */

const AI_SYSTEM_PROMPT = `You are the backend inference engine for a Dus Ka Dum style game show.

You have 10 trained logistic regression ML models predicting social media behaviour:
  1. morning_scroll    – Does user scroll SM first thing in the morning?
  2. distraction       – Does user find SM distracting from work/study?
  3. buying            – Does SM influence the user's buying decisions?
  4. privacy           – Does the user have high SM privacy concerns?
  5. reduce_usage      – Does the user want to reduce their SM usage?
  6. addiction         – Does the user show signs of SM addiction?
  7. mental_health     – Has SM negatively impacted the user's mental health?
  8. attention         – Has SM reduced the user's attention span?
  9. week_without_sm   – Could the user go a full week without SM?
  10. tools            – Does the user use digital tools to limit SM time?

Given a user profile:
  1. Run each model → predict Yes/No for THIS specific user.
  2. Estimate what percentage of ALL survey respondents with a SIMILAR profile said YES.
     Percentages must be realistic and vary meaningfully based on inputs. Examples:
       • 5+ hrs/day  → addiction %, distraction %, morning_scroll % should be noticeably higher
       • LinkedIn    → tools % and privacy % tend to be higher
       • Student     → buying % and distraction % trend higher
       • Anxious/Drained emotion → mental_health % and reduce_usage % trend higher
       • Age 45+     → week_without_sm % tends to be higher
  3. Write one brief key_factor sentence per model (main driver).

Return ONLY valid JSON — no markdown, no code fences, no extra text.

Required structure:
{
  "morning_scroll":  { "prediction": "Yes", "similar_users_pct": 55, "key_factor": "..." },
  "distraction":     { "prediction": "Yes", "similar_users_pct": 62, "key_factor": "..." },
  "buying":          { "prediction": "Yes", "similar_users_pct": 54, "key_factor": "..." },
  "privacy":         { "prediction": "Yes", "similar_users_pct": 58, "key_factor": "..." },
  "reduce_usage":    { "prediction": "Yes", "similar_users_pct": 61, "key_factor": "..." },
  "addiction":       { "prediction": "No",  "similar_users_pct": 43, "key_factor": "..." },
  "mental_health":   { "prediction": "No",  "similar_users_pct": 49, "key_factor": "..." },
  "attention":       { "prediction": "Yes", "similar_users_pct": 55, "key_factor": "..." },
  "week_without_sm": { "prediction": "No",  "similar_users_pct": 28, "key_factor": "..." },
  "tools":           { "prediction": "No",  "similar_users_pct": 22, "key_factor": "..." }
}`;

/**
 * callAnthropicForPredictions
 *
 * @param {Object} profile  User profile from intro form
 * @returns {Promise<Object>} Parsed prediction JSON keyed by modelKey
 */
async function callAnthropicForPredictions(profile) {
  const userMessage = `User Profile:
- Age Group:         ${profile.age}
- Gender:            ${profile.gender}
- Occupation:        ${profile.occupation}
- Daily Screen Time: ${profile.screenTime} hours
- No. of Platforms:  ${profile.numPlatforms}
- Posts per day:     ${profile.postsPerDay}
- Primary Platform:  ${profile.platform}
- Post-usage Emotion:${profile.emotion}

Run all 10 ML models on this profile. Return only the JSON.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:     AI_SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${err}`);
  }

  const data  = await response.json();
  const raw   = data.content.map(i => i.text || '').join('');
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
