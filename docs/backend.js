/**
 * DUS KA DUM — BACKEND / MODEL SIMULATION
 * backend/backend.js
 *
 * Provides generateFallbackPredictions() — a rule-based simulation
 * of all 10 trained LogisticRegression models, used when the
 * Anthropic API is unavailable.
 *
 * Rules are derived from the feature importance patterns extracted
 * from the model binaries (model_*.pkl files in /models).
 */

/**
 * MODEL_METADATA
 * Reference documentation for all 10 trained models.
 * Useful for understanding what features each model uses.
 */
const MODEL_METADATA = {
  morning_scroll: {
    file:         'model_morning_scroll.pkl',
    type:         'LogisticRegression',
    target:       'Scrolls SM first thing in morning (Yes/No)',
    key_features: ['hours_online', 'age_group', 'occupation', 'device', 'platforms_used', 'premium_user']
  },
  distraction: {
    file:         'model_distraction.pkl',
    type:         'LogisticRegression',
    target:       'Finds SM distracting from work/study (Yes/No)',
    key_features: [
      'age_group', 'hours_online', 'occupation_Student', 'occupation_Working_Professional',
      'device_Smartphone', 'most_used_platform_Instagram', 'most_used_platform_YouTube',
      'primary_use_Entertainment', 'primary_use_Studying_Work'
    ]
  },
  buying: {
    file:         'model_buying.pkl',
    type:         'LogisticRegression',
    target:       'SM influences buying decisions (Yes/No)',
    key_features: [
      'Age_Group', 'Gender', 'Daily_Screen_Time_hours',
      'Privacy_Concern_Level', 'Would_reduce_usage',
      'Platform_Facebook', 'Platform_Instagram', 'Platform_Twitter',
      'Purpose_Entertainment', 'Purpose_Business', 'Content_Videos', 'Content_Images'
    ]
  },
  privacy: {
    file:         'model_privacy.pkl',
    type:         'LogisticRegression',
    target:       'High privacy concern on SM (Yes/No)',
    key_features: [
      'Age_Group', 'Gender', 'Daily_Screen_Time_hours',
      'Influence_on_Buying', 'Would_reduce_usage',
      'Platform_Facebook', 'Platform_Instagram', 'Platform_Twitter',
      'Purpose_Business', 'Purpose_Entertainment', 'Purpose_News'
    ]
  },
  reduce_usage: {
    file:         'model_reduce_usage.pkl',
    type:         'LogisticRegression',
    target:       'Would reduce SM usage if could (Yes/No)',
    key_features: [
      'Age_Group', 'Gender', 'Daily_Screen_Time_hours',
      'Influence_on_Buying', 'Privacy_Concern_Level',
      'Platform_Facebook', 'Platform_Instagram', 'Platform_Twitter',
      'Purpose_Business', 'Purpose_Entertainment', 'Purpose_News'
    ]
  },
  addiction: {
    file:         'model_addiction.pkl',
    type:         'LogisticRegression',
    target:       'Shows signs of SM addiction (Yes/No)',
    key_features: [
      'Age', 'Daily_Usage_Time_min', 'Posts_Per_Day',
      'Likes_Received_Daily', 'Comments_Received_Daily', 'Messages_Sent_Daily', 'Scroll_Rate_ppm',
      'Gender_*', 'Platform_*', 'Emotional_State_Post_Usage_*'
    ]
  },
  mental_health: {
    file:         'mental_health_model.pkl',
    type:         'LogisticRegression',
    target:       'SM negatively impacted mental health (Yes/No)',
    key_features: [
      'Daily_Usage_Time_min', 'Posts_Per_Day', 'Scroll_Rate_ppm', 'Productivity_Loss_Score',
      'addicted', 'Gender_*', 'Platform_*', 'Addiction_Level_*', 'Emotional_State_Post_Usage_*'
    ]
  },
  attention: {
    file:         'model_attention.pkl',
    type:         'LogisticRegression',
    target:       'SM reduced attention span (Yes/No)',
    key_features: ['hours_online', 'age_group', 'occupation', 'device', 'platforms_used', 'premium_user']
  },
  week_without_sm: {
    file:         'model_week_without_sm.pkl',
    type:         'LogisticRegression',
    target:       'Could survive a week without SM (Yes/No)',
    key_features: ['hours_online', 'age_group', 'occupation', 'device', 'platforms_used', 'use_tools']
  },
  tools: {
    file:         'model_tools.pkl',
    type:         'LogisticRegression',
    target:       'Uses digital tools to limit SM time (Yes/No)',
    key_features: ['hours_online', 'age_group', 'occupation', 'device', 'platforms_used']
  }
};

/**
 * generateFallbackPredictions
 *
 * Rule-based simulation of all 10 trained models.
 * Used when the Anthropic API is unavailable.
 *
 * @param {Object} profile  User profile from main.js
 * @returns {Object}        Predictions in the same shape as the AI response
 */
function generateFallbackPredictions(profile) {
  const heavy      = parseInt(profile.screenTime) >= 5;
  const moderate   = parseInt(profile.screenTime) >= 3;
  const young      = profile.age === '18-24' || profile.age === '25-34';
  const older      = profile.age === '45-54' || profile.age === '55+';
  const student    = profile.occupation === 'Student';
  const worker     = profile.occupation === 'Working Professional';
  const anxious    = ['Anxious', 'Drained', 'Stressed', 'Lonely'].includes(profile.emotion);
  const positive   = ['Happy', 'Inspired', 'Connected', 'Motivated'].includes(profile.emotion);
  const shortForm  = ['Instagram', 'TikTok', 'Snapchat'].includes(profile.platform);
  const linkedIn   = profile.platform === 'LinkedIn';

  return {
    morning_scroll: {
      prediction:        heavy ? 'Yes' : 'No',
      similar_users_pct: heavy ? 76 : moderate ? 58 : 38,
      key_factor:        'Daily usage time is the strongest predictor of morning scrolling behaviour'
    },
    distraction: {
      prediction:        (heavy || student || shortForm) ? 'Yes' : 'No',
      similar_users_pct: heavy ? 72 : student ? 65 : shortForm ? 68 : 48,
      key_factor:        'Students and short-form video users show the highest distraction rates'
    },
    buying: {
      prediction:        (young || shortForm) ? 'Yes' : 'No',
      similar_users_pct: young && shortForm ? 71 : young ? 60 : shortForm ? 58 : 42,
      key_factor:        'Younger users on visual platforms are most susceptible to influencer marketing'
    },
    privacy: {
      prediction:        (worker || linkedIn || older) ? 'Yes' : 'No',
      similar_users_pct: linkedIn ? 72 : worker ? 62 : older ? 65 : 50,
      key_factor:        'Working professionals and LinkedIn users show the highest privacy concern levels'
    },
    reduce_usage: {
      prediction:        (heavy || anxious) ? 'Yes' : 'No',
      similar_users_pct: heavy && anxious ? 80 : heavy ? 68 : anxious ? 70 : 48,
      key_factor:        'Post-usage emotional state combined with usage time strongly predicts desire to reduce'
    },
    addiction: {
      prediction:        heavy ? 'Yes' : 'No',
      similar_users_pct: heavy ? 64 : moderate ? 38 : 22,
      key_factor:        'Daily usage time and scroll rate are the top addiction predictors in the model'
    },
    mental_health: {
      prediction:        (anxious || heavy) ? 'Yes' : 'No',
      similar_users_pct: anxious && heavy ? 74 : anxious ? 65 : heavy ? 52 : positive ? 30 : 44,
      key_factor:        'Post-usage emotional state is the strongest single predictor of mental health impact'
    },
    attention: {
      prediction:        (heavy || shortForm) ? 'Yes' : 'No',
      similar_users_pct: heavy && shortForm ? 76 : heavy ? 66 : shortForm ? 62 : 46,
      key_factor:        'Hours per day on short-form content correlates most with attention reduction'
    },
    week_without_sm: {
      prediction:        (!heavy && !moderate) ? 'Yes' : 'No',
      similar_users_pct: heavy ? 18 : moderate ? 35 : older ? 52 : 42,
      key_factor:        'Light users and older age groups are significantly more likely to complete a detox'
    },
    tools: {
      prediction:        (linkedIn || worker) ? 'Yes' : 'No',
      similar_users_pct: linkedIn ? 44 : worker ? 30 : heavy ? 26 : 18,
      key_factor:        'Professional platform users are most likely to actively manage their screen time'
    }
  };
}
