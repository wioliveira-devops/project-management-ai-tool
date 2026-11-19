import './AiGeneratedLabel.css'

type AiGeneratedLabelProps = {
  className?: string
}

/** A visible, accessible source label for AI-generated content. */
export function AiGeneratedLabel({ className }: AiGeneratedLabelProps) {
  const classes = ['ai-generated-label', className].filter(Boolean).join(' ')

  return (
    <span className={classes} aria-label="AI-generated content">
      AI-generated
    </span>
  )
}
