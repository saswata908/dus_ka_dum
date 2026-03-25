/**
 * DUS KA DUM — GAME LOGIC (UPDATED)
 * frontend/js/game.js
 *
 * Handles: timer, prize ladder, question rendering,
 * answer selection & reveal, lifelines, scoring,
 * screen transitions, end-game summary.
 * 
 * NEW: AI suggests answer but user decides to lock it in
 */

// ── Game State ──────────────────────────────────────────────────────────────
let gameQuestions = [];
let currentQ      = 0;
let selectedOpt   = -1;
let answered      = false;
let score         = 0;
let timerVal      = 30;
let timerInterval = null;
let doubleActive  = false;
let lifelineUsed  = { audience: false, flip: false, double: false };
let aiSuggestion  = true;   // NEW: AI suggests answer (user decides to lock)
let aiSuggestDelay = 2000;  // NEW: Delay before AI suggests answer (ms)
let aiSuggestedOption = -1; // NEW: Track which option AI suggested

// ─��� Screen Helpers ──────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showLoading(text, sub) {
  document.getElementById('loading-text').textContent = text;
  document.getElementById('loading-sub').textContent  = sub;
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// ── Prize Helpers ───────────────────────────────────────────────────────────
function getSafePrize() {
  if (score >= 8) return PRIZES[7].amount;
  if (score >= 4) return PRIZES[3].amount;
  return '₹0';
}

function buildPrizeLadder() {
  const container = document.getElementById('prize-ladder');
  container.innerHTML = '';
  [...PRIZES].reverse().forEach((p, i) => {
    const level = PRIZES.length - i;
    let cls = 'prize-row';
    if (p.milestone)            cls += ' milestone';
    if (level === currentQ + 1) cls += ' active';
    if (level <= score)         cls += ' won';
    const row = document.createElement('div');
    row.className = cls;
    row.id = 'prize-row-' + level;
    row.innerHTML = `<span class="prize-num">${level}</span><span class="prize-amt">${p.amount}</span>`;
    container.appendChild(row);
  });
}

// ── Timer ───────────────────────────────────────────────────────────────────
function startTimer() {
  timerVal = 30;
  stopTimer();
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerVal--;
    updateTimerDisplay();
    if (timerVal <= 0) {
      stopTimer();
      if (!answered) { answered = true; revealAnswer(-1); }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateTimerDisplay() {
  const numEl  = document.getElementById('timer-num');
  const circle = document.getElementById('timer-circle');
  numEl.textContent = timerVal;
  circle.style.strokeDashoffset = 188 * (1 - timerVal / 30);
  const color = timerVal <= 10 ? 'var(--red)' : timerVal <= 20 ? 'var(--orange)' : 'var(--gold)';
  circle.style.stroke = color;
  numEl.style.color   = color;
}

// ── Question Rendering ────────────────────────────────────���─────────────────
function getCorrectOption(q) {
  const pct = q.actualPct;
  const t   = q.thresholds;
  if (q.reversed) {
    if (pct > t[0]) return 0;
    if (pct > t[1]) return 1;
    if (pct > t[2]) return 2;
    return 3;
  }
  if (pct <= t[0]) return 0;
  if (pct <= t[1]) return 1;
  if (pct <= t[2]) return 2;
  return 3;
}

function renderQuestion() {
  if (currentQ >= gameQuestions.length) { endGame(); return; }
  const q = gameQuestions[currentQ];

  document.getElementById('qnum').textContent         = `${currentQ + 1}/10`;
  document.getElementById('question-text').textContent = q.topic;
  document.getElementById('profile-hint').textContent =
    `👤 Based on: ${userProfile.age} • ${userProfile.platform} user • ` +
    `${userProfile.screenTime}hrs/day • Feels ${userProfile.emotion} after SM`;

  document.getElementById('meter-area').style.display = 'none';
  document.getElementById('audience-section').classList.remove('show');
  document.getElementById('result-panel').classList.remove('show');
  document.getElementById('model-insight').style.display = 'none';

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.style.display = '';
  submitBtn.textContent   = 'LOCK IT IN';
  submitBtn.disabled      = false;
  submitBtn.onclick       = submitAnswer;

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.id        = 'opt-' + i;
    btn.innerHTML = `
      <div class="option-letter">${String.fromCharCode(65 + i)}</div>
      <div class="option-text">${opt}</div>
      <div class="option-pct" id="pct-${i}"></div>
      <div class="option-bar" id="bar-${i}"></div>
      <div class="ai-badge" id="ai-badge-${i}"></div>`;
    btn.onclick = () => selectOption(i);
    grid.appendChild(btn);
  });

  buildPrizeLadder();
  answered = false; selectedOpt = -1; doubleActive = false; aiSuggestedOption = -1;
  startTimer();

  // NEW: AI suggestion logic (suggests but doesn't auto-submit)
  if (aiSuggestion) {
    aiSuggestAnswer();
  }
}

// ── NEW: AI Suggestion (User Decides) ───────────────────────────────────────
function aiSuggestAnswer() {
  const q = gameQuestions[currentQ];
  const suggestedOption = getCorrectOption(q);
  aiSuggestedOption = suggestedOption;

  // Wait for aiSuggestDelay, then suggest the answer
  setTimeout(() => {
    // Highlight the suggested option with a badge
    const suggestedBtn = document.getElementById('opt-' + suggestedOption);
    if (suggestedBtn) {
      const badge = document.getElementById('ai-badge-' + suggestedOption);
      if (badge) {
        badge.textContent = '🤖 AI SUGGESTS';
        badge.style.display = 'block';
        badge.style.fontSize = '0.75rem';
        badge.style.color = '#FFD700';
        badge.style.fontWeight = 'bold';
        badge.style.marginTop = '4px';
      }
      suggestedBtn.style.borderColor = '#FFD700';
      suggestedBtn.style.borderWidth = '3px';
      suggestedBtn.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
    }
  }, aiSuggestDelay);
}

// ── Selection & Submit ──────────────────────────────────────────────────────
function selectOption(i) {
  if (answered) return;
  document.querySelectorAll('.option-btn').forEach(b => {
    b.classList.remove('selected');
    b.style.borderColor = '';
    b.style.borderWidth = '';
    b.style.boxShadow = '';
  });
  selectedOpt = i;
  document.getElementById('opt-' + i).classList.add('selected');
  
  // If this is the AI suggested option, keep the gold border
  if (i === aiSuggestedOption) {
    document.getElementById('opt-' + i).style.borderColor = '#FFD700';
    document.getElementById('opt-' + i).style.borderWidth = '3px';
    document.getElementById('opt-' + i).style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
  }
}

function submitAnswer() {
  if (selectedOpt === -1 || answered) return;
  stopTimer();
  answered = true;
  revealAnswer(selectedOpt);
}

// ── Reveal ──────────────────────────────────────────────────────────────────
function revealAnswer(chosen) {
  const q       = gameQuestions[currentQ];
  const correct = getCorrectOption(q);
  const pct     = q.actualPct;

  // Animate meter bar
  document.getElementById('meter-area').style.display = 'block';
  setTimeout(() => {
    document.getElementById('meter-fill').style.width = pct + '%';
    document.getElementById('meter-pct').textContent  = pct + '%';
  }, 300);

  // Colour options + show distribution bars
  q.options.forEach((_, i) => {
    const fakeP = i === correct
      ? pct
      : Math.floor((100 - pct) / 3 * (0.5 + Math.random()));
    setTimeout(() => {
      document.getElementById('pct-' + i).textContent = fakeP + '%';
      document.getElementById('pct-' + i).classList.add('show');
      document.getElementById('bar-' + i).style.width = fakeP + '%';
    }, 600);
    if (i === correct)                       setTimeout(() => document.getElementById('opt-' + i).classList.add('correct'), 800);
    else if (i === chosen && i !== correct)  setTimeout(() => document.getElementById('opt-' + i).classList.add('wrong'),   800);
  });

  setTimeout(() => showResult(chosen === correct, q), 2000);
}

// ── Result Panel ────────────────────────────────────────────────────────────
function showResult(isCorrect, q) {
  const title     = document.getElementById('result-title');
  const scoreEl   = document.getElementById('result-score');
  const insightEl = document.getElementById('model-insight');

  document.getElementById('submit-btn').style.display = 'none';

  if (isCorrect) {
    score = currentQ + 1;
    title.textContent   = 'BILKUL SAHI! 🎯';
    title.className     = 'result-title win';
    scoreEl.textContent = `You won ${PRIZES[currentQ].amount}!`;
    document.getElementById('result-emoji').textContent = currentQ === 9 ? '👑' : '🏆';
  } else {
    title.textContent   = 'WRONG ANSWER! 😢';
    title.className     = 'result-title lose';
    scoreEl.textContent = `The answer was ${q.actualPct}%. You go home with ${getSafePrize()}.`;
    document.getElementById('result-emoji').textContent = '💔';
  }

  if (q.keyFactor) {
    insightEl.style.display = 'block';
    insightEl.innerHTML = `<strong>🤖 Insight:</strong> ${q.keyFactor}. ` +
      `The model predicted ${q.prediction} for your profile — and ${q.actualPct}% of similar users agreed.`;
  }

  document.getElementById('winnings').textContent = score > 0 ? PRIZES[score - 1].amount : '₹0';
  document.getElementById('next-btn').style.display = (currentQ < 9 && isCorrect) ? '' : 'none';
  document.getElementById('result-panel').classList.add('show');
  buildPrizeLadder();

  if (!isCorrect) setTimeout(() => endGame(), 4000);
}

// ── Navigation ──────────────────────────────────────────────────────────────
function nextQuestion() {
  currentQ++;
  document.getElementById('result-panel').classList.remove('show');
  renderQuestion();
}

function quitGame() {
  stopTimer();
  const safe = score > 0 ? PRIZES[score - 1].amount : getSafePrize();
  document.getElementById('result-title').textContent  = 'SAFE EXIT! 🏅';
  document.getElementById('result-title').className    = 'result-title win';
  document.getElementById('result-score').textContent  = `You safely take ${safe} home!`;
  document.getElementById('result-emoji').textContent  = '🏅';
  document.getElementById('next-btn').style.display    = 'none';
  document.getElementById('submit-btn').style.display  = 'none';
  document.getElementById('result-panel').classList.add('show');
  answered = true;
  setTimeout(() => endGame(), 3000);
}

// ── Lifelines ───────────────────────────────────────────────────────────────
function useLifeline(type) {
  if (lifelineUsed[type] || answered) return;
  lifelineUsed[type] = true;
  document.getElementById('ll-' + type).classList.add('used');
  document.getElementById('lifeline-count').textContent =
    Object.values(lifelineUsed).filter(v => !v).length;

  if      (type === 'audience') fiftyFifty();
  else if (type === 'flip')     skipQuestion();
  else if (type === 'double')   activateDoubleDip();
}

function fiftyFifty() {
  const correct = getCorrectOption(gameQuestions[currentQ]);
  const toRemove = [0, 1, 2, 3]
    .filter(i => i !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  toRemove.forEach(i => {
    const btn = document.getElementById('opt-' + i);
    btn.style.opacity       = '0.25';
    btn.style.pointerEvents = 'none';
    btn.style.filter        = 'grayscale(1)';
  });
  document.getElementById('audience-section').classList.add('show');
}

function skipQuestion() {
  stopTimer();
  currentQ++;
  document.getElementById('audience-section').classList.remove('show');
  if (currentQ >= gameQuestions.length) { endGame(); return; }
  renderQuestion();
}

function activateDoubleDip() {
  doubleActive = true;
  const btn    = document.getElementById('submit-btn');
  btn.textContent = '1ST ATTEMPT';

  btn.onclick = function firstAttempt() {
    if (selectedOpt === -1) return;
    if (selectedOpt === getCorrectOption(gameQuestions[currentQ])) {
      stopTimer(); answered = true; revealAnswer(selectedOpt);
      btn.textContent = 'LOCK IT IN'; btn.onclick = submitAnswer;
    } else {
      document.getElementById('opt-' + selectedOpt).classList.add('wrong');
      document.getElementById('opt-' + selectedOpt).style.pointerEvents = 'none';
      selectedOpt = -1;
      btn.textContent = '2ND ATTEMPT';
      btn.onclick = function secondAttempt() {
        if (selectedOpt === -1) return;
        stopTimer(); answered = true; revealAnswer(selectedOpt);
        btn.textContent = 'LOCK IT IN'; btn.onclick = submitAnswer;
      };
    }
  };
}

// ── End Game ────────────────────────────────────────────────────────────────
function endGame() {
  stopTimer();
  showScreen('screen-final');

  const finalPrize = score > 0 ? PRIZES[score - 1].amount : getSafePrize();
  document.getElementById('final-trophy').textContent = score >= 8 ? '👑' : score >= 5 ? '🏆' : score >= 3 ? '🥈' : '💔';
  document.getElementById('final-title').textContent  = score >= 8 ? 'CHAMPION!' : score >= 5 ? 'WELL PLAYED!' : score >= 3 ? 'GOOD EFFORT' : 'GAME OVER';
  document.getElementById('final-amount').textContent = finalPrize;
  document.getElementById('final-msg').textContent    =
    `You answered ${score} out of ${Math.min(currentQ + 1, 10)} questions correctly. ` +
    `Based on your profile (${userProfile.platform} user, ${userProfile.screenTime}hrs/day, ` +
    `feeling ${userProfile.emotion}), here's what the models predicted about you:`;

  const grid = document.getElementById('insights-grid');
  grid.innerHTML = '';
  Object.entries(allPredictions).forEach(([key, val]) => {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.innerHTML = `
      <div class="topic">${key.replace(/_/g, ' ').toUpperCase()}</div>
      <div class="pred ${val.prediction === 'Yes' ? 'yes' : 'no'}">${val.prediction === 'Yes' ? '✅ YES' : '❌ NO'}</div>
      <div class="pct">${val.similar_users_pct}% of similar users</div>`;
    grid.appendChild(card);
  });
}
