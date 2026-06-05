import QuestionnaireForm from './QuestionnaireForm'
import { TUTOR_ASSESSMENT_QUESTIONS } from './surveyConfigs'

/** Tutor reflects on their own teaching. Writes to tutor_assessments. */
export default function TutorAssessmentForm() {
  return (
    <QuestionnaireForm
      title="Tutor Self-Assessment"
      intro="Reflect on your own teaching this period."
      questions={TUTOR_ASSESSMENT_QUESTIONS}
      table="tutor_assessments"
    />
  )
}
