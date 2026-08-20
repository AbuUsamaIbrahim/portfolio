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

export const collections = { 'case-studies': caseStudies };
