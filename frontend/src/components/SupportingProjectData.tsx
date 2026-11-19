import { useId } from 'react'
import './SupportingProjectData.css'

export type SupportingProjectDataItem = {
  id: string
  label: string
  value: string | number
  source: string
  sourceHref?: string
}

type SupportingProjectDataProps = {
  items: readonly SupportingProjectDataItem[]
  title?: string
}

/** Shows source project values behind an insight without presenting them as AI output. */
export function SupportingProjectData({
  items,
  title = 'Supporting project data',
}: SupportingProjectDataProps) {
  const headingId = useId()

  if (items.length === 0) return null

  return (
    <section className="supporting-project-data" aria-labelledby={headingId}>
      <h3 className="supporting-project-data__title" id={headingId}>
        {title}
      </h3>
      <dl className="supporting-project-data__facts">
        {items.map((item) => (
          <div className="supporting-project-data__item" key={item.id}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
            <p className="supporting-project-data__source">
              Source:{' '}
              {item.sourceHref ? (
                <a href={item.sourceHref}>View {item.source}</a>
              ) : (
                item.source
              )}
            </p>
          </div>
        ))}
      </dl>
    </section>
  )
}
