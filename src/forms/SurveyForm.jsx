import { useParams } from 'react-router-dom'
import QuestionnaireForm from './QuestionnaireForm'
import { SURVEY_CONFIGS } from './surveyConfigs'
import shared from '../components/shared.module.css'

/**
 * Config-driven survey form. The :type URL param selects which survey from
 * SURVEY_CONFIGS to render; survey_type is persisted on the surveys row.
 */
export default function SurveyForm() {
  const { type } = useParams()
  const config = SURVEY_CONFIGS[type]

  if (!config) {
    return (
      <div className={`${shared.page} ${shared.narrow}`}>
        <h1>Survey</h1>
        <p className={shared.muted}>Unknown survey type: {type}</p>
      </div>
    )
  }

  return (
    <QuestionnaireForm
      title={config.title}
      intro={config.intro}
      questions={config.questions}
      table="surveys"
      extraColumns={{ survey_type: type }}
    />
  )
}
