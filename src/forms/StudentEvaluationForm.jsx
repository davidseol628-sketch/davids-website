import QuestionnaireForm from './QuestionnaireForm'
import { STUDENT_EVALUATION_QUESTIONS } from './surveyConfigs'

/** Tutor evaluates a student's progress. Writes to student_evaluations. */
export default function StudentEvaluationForm() {
  return (
    <QuestionnaireForm
      title="Student Evaluation"
      intro="Evaluate a student's progress and engagement."
      questions={STUDENT_EVALUATION_QUESTIONS}
      table="student_evaluations"
    />
  )
}
