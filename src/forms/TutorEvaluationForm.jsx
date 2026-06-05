import QuestionnaireForm from './QuestionnaireForm'
import { TUTOR_EVALUATION_QUESTIONS } from './surveyConfigs'

/** Admin evaluates a tutor's performance. Writes to tutor_evaluations. */
export default function TutorEvaluationForm() {
  return (
    <QuestionnaireForm
      title="Tutor Evaluation"
      intro="Evaluate a tutor's performance."
      questions={TUTOR_EVALUATION_QUESTIONS}
      table="tutor_evaluations"
    />
  )
}
