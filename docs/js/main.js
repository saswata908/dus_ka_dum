/**
 * DUS KA DUM — MAIN ENTRY POINT (UPDATED)
 * frontend/js/main.js
 *
 * Profile collection, chip interactions, game boot.
 * AI plays the game and predicts answers.
 * Questions are shuffled each game.
 * Depends on: data.js, game.js, ai/ai.js, backend/backend.js
 */

// ── Shared globals (used across all modules) ────────────────────────────────
let userProfile    = {};
let allPredictions = {};
let aiMode         = true;  // NEW: AI plays the game

// ── Chip Interaction ────────────────────────────────────────────────────────
document.querySelectorAll('#platform-grid .platform-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#platform-grid .platform-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });
});

document.querySelectorAll('#emotion-grid .emotion-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#emotion-grid .emotion-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });
});

// ── Form Helpers ────────────────────────────────────────────────────────────
function getPlatform() {
  const sel = document.querySelector('#platform-grid .platform-chip.selected');
  return sel ? sel.dataset.val : 'Instagram';
}

function getEmotion() {
  const sel = document.querySelector('#emotion-grid .emotion-chip.selected');
  return sel ? sel.dataset.val : 'Happy';
}

// ── Game Boot ────────────────────────────────────────────────────────────────
async function startGame() {
  userProfile = {
    age:          document.getElementById('inp-age').value,
    gender:       document.getElementById('inp-gender').value,
    occupation:   document.getElementById('inp-occupation').value,
    screenTime:   document.getElementById('inp-screen').value,
    numPlatforms: document.getElementById('inp-platforms').value,
    postsPerDay:  document.getElementById('inp-posts').value,
    platform:     getPlatform(),
    emotion:      getEmotion()
  };

  showLoading('ANALYSING YOUR PROFILE...', 'Running prediction models on your data');

  try {
    // Primary: Anthropic Claude API  (ai/ai.js)
    allPredictions = await callAnthropicForPredictions(userProfile);
  } catch (e) {
    console.warn('AI API unavailable — using rule-based fallback:', e.message);
    // Fallback: rule-based model simulation  (backend/backend.js)
    allPredictions = generateFallbackPredictions(userProfile);
  }

  // Inject AI/backend predictions into static question data
  gameQuestions = MODEL_QUESTIONS.map(q => {
    const pred = allPredictions[q.modelKey] || { similar_users_pct: 50, prediction: 'Yes', key_factor: '' };
    return { ...q, actualPct: pred.similar_users_pct, prediction: pred.prediction, keyFactor: pred.key_factor };
  });

  // NEW: Shuffle questions for variety
  gameQuestions = shuffleArray(gameQuestions);

  // Reset state
  currentQ     = 0;
  score        = 0;
  selectedOpt  = -1;
  answered     = false;
  lifelineUsed = { audience: false, flip: false, double: false };
  document.getElementById('lifeline-count').textContent = 3;
  ['ll-audience', 'll-flip', 'll-double'].forEach(id =>
    document.getElementById(id).classList.remove('used')
  );

  hideLoading();
  showScreen('screen-game');
  renderQuestion();
}

// ── NEW: Shuffle Array (Fisher-Yates) ───────────────────────────────────────
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
