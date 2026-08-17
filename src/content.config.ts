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
    diagram: z.enum(['pipeline', 'ledger', 'gateway', 'erp', 'microservices']),
    accent: z.string().default('#22d3ee'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { 'case-studies': caseStudies };
