import QuestionnaireForm from './QuestionnaireForm'
import { PARENT_ASSESSMENT_QUESTIONS } from './surveyConfigs'

/** Parent assesses the tutor and the enrichment center. Writes to parent_assessments. */
export default function ParentAssessmentForm() {
  return (
    <QuestionnaireForm
      title="Parent Assessment"
      intro="Share your assessment of your child's tutor and the enrichment center."
      questions={PARENT_ASSESSMENT_QUESTIONS}
      table="parent_assessments"
    />
  )
}
