/**
 * Config-driven survey definitions, keyed by survey_type (the URL param at
 * /forms/survey/:type). Question wording here is a sensible default — David can
 * edit later. Each question: { name, label, type, required }.
 *  type: 'rating' (1–5 scale) | 'text' (short) | 'textarea' (long)
 */
export const SURVEY_CONFIGS = {
  parent_satisfaction: {
    title: 'Parent Satisfaction Survey',
    intro: 'Tell us how we are doing. Your feedback helps us improve.',
    questions: [
      { name: 'overall', label: 'Overall, how satisfied are you with the enrichment center?', type: 'rating', required: true },
      { name: 'communication', label: 'How would you rate our communication with you?', type: 'rating', required: true },
      { name: 'value', label: 'How would you rate the value of our programs?', type: 'rating', required: true },
      { name: 'recommend', label: 'How likely are you to recommend us to other parents?', type: 'rating', required: true },
      { name: 'comments', label: 'Anything else you would like us to know?', type: 'textarea', required: false },
    ],
  },
  student_satisfaction: {
    title: 'Student Satisfaction Survey',
    intro: 'Let us know how you feel about your classes.',
    questions: [
      { name: 'enjoyment', label: 'How much do you enjoy your classes?', type: 'rating', required: true },
      { name: 'learning', label: 'How much do you feel you are learning?', type: 'rating', required: true },
      { name: 'tutor', label: 'How helpful is your tutor?', type: 'rating', required: true },
      { name: 'comments', label: 'What could we do better?', type: 'textarea', required: false },
    ],
  },
}

export const STUDENT_EVALUATION_QUESTIONS = [
  { name: 'effort', label: 'Effort and engagement', type: 'rating', required: true },
  { name: 'progress', label: 'Academic progress this period', type: 'rating', required: true },
  { name: 'behavior', label: 'Classroom behavior', type: 'rating', required: true },
  { name: 'strengths', label: 'Notable strengths', type: 'textarea', required: false },
  { name: 'areas', label: 'Areas to improve', type: 'textarea', required: false },
]

export const TUTOR_EVALUATION_QUESTIONS = [
  { name: 'preparation', label: 'Lesson preparation', type: 'rating', required: true },
  { name: 'communication', label: 'Communication with students and parents', type: 'rating', required: true },
  { name: 'effectiveness', label: 'Teaching effectiveness', type: 'rating', required: true },
  { name: 'professionalism', label: 'Professionalism', type: 'rating', required: true },
  { name: 'comments', label: 'Comments', type: 'textarea', required: false },
]

export const TUTOR_ASSESSMENT_QUESTIONS = [
  { name: 'strengths', label: 'What are your teaching strengths?', type: 'textarea', required: true },
  { name: 'challenges', label: 'What challenges did you face?', type: 'textarea', required: false },
  { name: 'confidence', label: 'Confidence in your subject area', type: 'rating', required: true },
  { name: 'goals', label: 'Goals for the next period', type: 'textarea', required: false },
]

export const PARENT_ASSESSMENT_QUESTIONS = [
  { name: 'tutor_quality', label: 'Quality of your child\'s tutor', type: 'rating', required: true },
  { name: 'center_quality', label: 'Quality of the enrichment center overall', type: 'rating', required: true },
  { name: 'progress', label: 'Your child\'s progress', type: 'rating', required: true },
  { name: 'comments', label: 'Comments', type: 'textarea', required: false },
]
