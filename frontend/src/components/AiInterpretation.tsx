import { useId } from 'react'
import { AiGeneratedLabel } from './AiGeneratedLabel'
import {
  SupportingProjectData,
  type SupportingProjectDataItem,
} from './SupportingProjectData'
import './AiInterpretation.css'

type AiInterpretationProps = {
  title: string
  interpretation: string
  supportingData?: readonly SupportingProjectDataItem[]
}

/** Frames generated text as a provisional interpretation, separate from source facts. */
export function AiInterpretation({
  title,
  interpretation,
  supportingData = [],
}: AiInterpretationProps) {
  const headingId = useId()

  if (!interpretation.trim()) return null

  return (
    <article className="ai-interpretation" aria-labelledby={headingId}>
      <header className="ai-interpretation__heading">
        <div className="ai-interpretation__labels">
          <AiGeneratedLabel />
          <span className="ai-interpretation__type">Possible interpretation</span>
        </div>
        <h2 id={headingId}>{title}</h2>
      </header>
      <p className="ai-interpretation__text">{interpretation}</p>
      <p className="ai-interpretation__notice" role="note">
        This AI-generated interpretation is not a verified project fact. Review the
        source data before acting on it.
      </p>
      {supportingData.length > 0 ? (
        <SupportingProjectData items={supportingData} />
      ) : (
        <p className="ai-interpretation__no-evidence" role="note">
          No supporting project data is shown for this interpretation. Treat it as an
          unverified possibility.
        </p>
      )}
    </article>
  )
}
