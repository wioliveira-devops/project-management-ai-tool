# AI Insight Visual Guidelines

## Purpose

Make the origin of information clear at a glance. Project facts, deterministic calculations, and AI-generated interpretations must look different and must be identified with text as well as color.

## Information treatments

### Project facts

Use the standard neutral surface and the existing body text style. Present source values as concise rows or metrics. When provenance is useful, label the section **Project data** and name the relevant source field or task. Do not give factual values the AI accent color.

Examples: project owner, task status, due date, priority, and target end date.

### Calculated results

Use the existing blue informational treatment, with a visible **Calculated** label when a value could be mistaken for an AI conclusion. Include the calculation or rule in plain language when the result needs explanation.

Examples: task completion counts, overdue counts, and deterministic project health indicators.

### AI-generated interpretations

Place generated summaries, explanations, and recommendations in a visually separate insight surface. Use a violet accent stripe or border and a visible **AI insight** or **AI-generated** label. Keep the surrounding surface subtle so the accent identifies origin without implying severity or approval. Keep warning colors such as amber and red for schedule risk and severity.

Use headings that frame generated content as interpretation or a possible action. Recommendations should read as options to review, not commands. Do not style AI output like a confirmed project fact.

## Shared visual rules

- Pair every color cue with a visible text label; color alone must never identify the information source.
- Keep project facts in the neutral visual system, calculations in the informational blue treatment, and AI interpretations in the violet insight treatment.
- Keep risk and status colors reserved for their existing meanings. An AI insight can describe a high-severity risk, but its AI-origin cue remains violet while the risk indicator remains amber or red.
- Use the same treatments across summaries, risk explanations, recommendations, and other generated content.
- In dark mode, preserve the same source cues with theme-appropriate backgrounds and readable text.
- Maintain at least WCAG AA contrast for text and controls. Do not rely on a thin color border as the only cue; retain the visible source label.
- On narrow layouts, keep the source label next to the content heading and allow the insight surface to stack naturally.

## Component pattern

An AI insight surface should contain:

1. A visible **AI insight** label near the heading.
2. A concise title describing the generated interpretation.
3. The generated text or suggested action.
4. A source or evidence area when supporting project data is available.
5. A short reminder that the output is generated and should be reviewed before acting.

Source facts and calculated values should remain visually distinct within the same view. If an insight references a fact, show the source value as evidence rather than restating the interpretation as verified data.

## Review checklist

- Can a user distinguish a project fact, a calculated result, and an AI interpretation without reading the full content?
- Does each source category have a visible text label as well as a consistent visual cue?
- Are amber and red used only for risk or severity, rather than to mark AI content?
- Is generated content framed as an insight or option instead of a confirmed fact or instruction?
- Do the distinctions remain clear in dark mode and on narrow screens?
## Reusable source label

Use the shared `AiGeneratedLabel` component next to the heading of any generated summary, explanation, or recommendation:

```tsx
import { AiGeneratedLabel } from './AiGeneratedLabel'

<div className="insight-heading">
  <h2>Project summary</h2>
  <AiGeneratedLabel />
</div>
```

The component renders the visible text **AI-generated** and an accessible name, with a violet accent and theme-aware foreground/background colors. Place it on generated content only. Keep source facts and calculated results on their separate treatments above.
## Supporting source data

Use `SupportingProjectData` below an insight when specific source values substantiate its claim. Pass only fields that are relevant to that insight, and include the project field or task that supplied each value:

```tsx
import { SupportingProjectData } from './SupportingProjectData'

<SupportingProjectData
  items={[
    {
      id: task.id,
      label: 'Due date',
      value: task.due_date ?? 'No due date',
      source: `Task: ${task.title}`,
      sourceHref: `#task-${encodeURIComponent(task.id)}`,
    },
  ]}
/>
```

The component renders no section when there is no supporting data. Keep its rows in the neutral project-data treatment; do not style source values as AI output or infer unsupported evidence. The label and value are text, and the optional source link points to the record that supplied them.
## Keeping interpretations separate from facts

Treat generated explanations and recommendations as provisional interpretations. Use conditional wording for inferences (for example, “may indicate” or “could suggest”) and do not state a cause, forecast, or user intent as fact unless the source records directly support that statement.

- Present verifiable values as source data, with the field or task that supplied them.
- Put AI interpretation in a separate section labeled **AI-generated** and **Possible interpretation**.
- State that generated interpretation is not a verified project fact and should be checked before acting.
- If no relevant supporting data is available, say so and mark the interpretation as unverified. Do not invent evidence to make it appear grounded.
- Keep recommendations phrased as options to consider, not instructions or confirmed next steps.

Use `AiInterpretation` to keep these cues, the generated text, and the optional `SupportingProjectData` section together. The component presents provenance and uncertainty clearly; it does not independently validate whether generated text is accurate. AI generation prompts and response validation should preserve the same distinction when those features are added.
