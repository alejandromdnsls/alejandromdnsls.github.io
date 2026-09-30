import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const cases = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      sector: z.string(),
      kind: z.enum(['producto', 'cliente', 'confidencial']),
      // Service slugs, see src/data/services.ts
      services: z.array(z.string()),
      stack: z.array(z.string()),
      summary: z.string(),
      // Public website of the product or client, when allowed
      url: z.url().optional(),
      // Optional screenshots: product screens with demo data only, or captures of public sites.
      images: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      order: z.number(),
      featured: z.boolean().default(false),
    // Drafts are kept in the repo but never built or linked (e.g. projects not in production yet).
    draft: z.boolean().default(false),
    }),
});

export const collections = { cases };
