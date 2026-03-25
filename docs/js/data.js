/**
 * DUS KA DUM — GAME DATA
 * frontend/js/data.js
 *
 * Prize ladder and the 10 ML-model-mapped survey questions.
 */

const PRIZES = [
  { level: 1,  amount: '₹1,000' },
  { level: 2,  amount: '₹2,000' },
  { level: 3,  amount: '₹3,000' },
  { level: 4,  amount: '₹5,000',         milestone: true },
  { level: 5,  amount: '₹10,000' },
  { level: 6,  amount: '₹20,000' },
  { level: 7,  amount: '₹40,000' },
  { level: 8,  amount: '₹80,000',        milestone: true },
  { level: 9,  amount: '₹1,60,000' },
  { level: 10, amount: '₹1,00,00,000',   milestone: true }
];

/**
 * MODEL_QUESTIONS
 * One entry per trained ML model.
 *
 * modelKey   — key returned in the AI / backend prediction JSON
 * topic      — question displayed to the player
 * options    — four answer bands shown as buttons
 * thresholds — upper boundary of bands A/B/C (D = everything above C)
 * insight    — fact revealed after the answer
 * reversed   — true when a lower % is the "better" outcome (week_without_sm)
 */
const MODEL_QUESTIONS = [
  {
    modelKey:   'morning_scroll',
    topic:      'Do people like you scroll social media first thing in the morning?',
    options:    ['Less than 25%', '25% – 45%', '46% – 65%', 'More than 65%'],
    thresholds: [25, 45, 65],
    insight:    'Morning social media scrolling is linked to higher anxiety levels throughout the day.'
  },
  {
    modelKey:   'distraction',
    topic:      'What percentage of people like you find social media distracting from work/study?',
    options:    ['Less than 35%', '35% – 55%', '56% – 72%', 'More than 72%'],
    thresholds: [35, 55, 72],
    insight:    'Social media distraction varies heavily by platform — short-form video apps score highest.'
  },
  {
    modelKey:   'buying',
    topic:      'How many people like you say social media influences their buying decisions?',
    options:    ['Less than 30%', '30% – 50%', '51% – 68%', 'More than 68%'],
    thresholds: [30, 50, 68],
    insight:    'Influencer content and sponsored posts are the #1 drivers of social media purchase decisions.'
  },
  {
    modelKey:   'privacy',
    topic:      'What percentage of people like you are concerned about privacy on social media?',
    options:    ['Less than 35%', '35% – 52%', '53% – 68%', 'More than 68%'],
    thresholds: [35, 52, 68],
    insight:    'Privacy concern levels have increased significantly since 2022 data breaches.'
  },
  {
    modelKey:   'reduce_usage',
    topic:      'Would people like you reduce their social media usage if they could?',
    options:    ['Less than 35%', '35% – 52%', '53% – 68%', 'More than 68%'],
    thresholds: [35, 52, 68],
    insight:    'Most people want to reduce usage but find it extremely difficult due to dopamine loops.'
  },
  {
    modelKey:   'addiction',
    topic:      'What percentage of people with your usage patterns show signs of social media addiction?',
    options:    ['Less than 20%', '20% – 38%', '39% – 55%', 'More than 55%'],
    thresholds: [20, 38, 55],
    insight:    'Addiction prediction uses daily usage time, scroll rate, and post-usage emotional state.'
  },
  {
    modelKey:   'mental_health',
    topic:      'How many people like you say social media has negatively impacted their mental health?',
    options:    ['Less than 30%', '30% – 48%', '49% – 65%', 'More than 65%'],
    thresholds: [30, 48, 65],
    insight:    'Mental health impact is highest among 18–24 year olds using Instagram and TikTok.'
  },
  {
    modelKey:   'attention',
    topic:      'What percentage of people like you feel social media has reduced their attention span?',
    options:    ['Less than 35%', '35% – 52%', '53% – 70%', 'More than 70%'],
    thresholds: [35, 52, 70],
    insight:    'Attention span reduction correlates with hours per day more than platform type.'
  },
  {
    modelKey:   'week_without_sm',
    topic:      'Could people like you survive a full week without any social media?',
    options:    ['More than 65%', '45% – 65%', '25% – 44%', 'Less than 25%'],
    thresholds: [65, 45, 25],
    insight:    'Digital detox success rate drops sharply for people with 3+ hours daily usage.',
    reversed:   true
  },
  {
    modelKey:   'tools',
    topic:      'What percentage of people like you use digital tools to limit their social media time?',
    options:    ['Less than 15%', '15% – 30%', '31% – 48%', 'More than 48%'],
    thresholds: [15, 30, 48],
    insight:    'Screen time apps and app timers are the most commonly used productivity tools.'
  }
];
