import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const decision = z.object({
  choice: z.string(),
  rejected: z.string(),
  because: z.string(),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    index: z.number(),
    title: z.string(),
    subtitle: z.string(),
    org: z.string(),
    period: z.string(),
    role: z.string(),
    summary: z.string(),
    /** Short, scannable facts. Never invent numbers here. */
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    stack: z.array(z.string()),
    /** Architecture decisions with the alternative that was rejected. */
    decisions: z.array(decision),
    /** Which diagram component to render for this study. */
    diagram: z.enum(['pipeline', 'ledger', 'gateway', 'erp', 'microservices', 'agentgate']),
    /** Public repository, when the work is not under NDA. */
    repo: z.string().optional(),
    /**
     * A running instance anyone can open.
     *
     * Optional, and deliberately a separate field from `repo`: it renders as the primary
     * call to action, so it must only be set once the URL actually resolves. A dead demo
     * link on a portfolio is worse than no demo link — it is a claim the reader can check
     * in one click.
     */
    demo: z.string().url().optional(),
    accent: z.string().default('#22d3ee'),
    draft: z.boolean().default(false),
  }),
});

/**
 * Field notes — the learning series, published as it happens.
 *
 * Deliberately a separate collection from the case studies rather than a `kind` field on
 * one. A case study argues an architecture I already shipped; a field note reports an
 * experiment I ran this week and the output it actually produced. They are ordered
 * differently (index vs date), they age differently, and a reader should never have to
 * work out which one they are reading.
 */
const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/field-notes' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    /** Ordering and the dateline. Notes are chronological; case studies are not. */
    date: z.coerce.date(),
    /** The running series this note belongs to, e.g. "Kubernetes". */
    series: z.string(),
    /** Where in that series' roadmap the note sits. Shown as the eyebrow beside the series. */
    stage: z.string().optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    /** The lab repository the note's commands and manifests come from. */
    repo: z.string().url().optional(),
    accent: z.string().default('#fbbf24'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { 'case-studies': caseStudies, 'field-notes': fieldNotes };
