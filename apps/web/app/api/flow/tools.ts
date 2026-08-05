import { tool } from 'ai';
import { z } from 'zod';

/**
 * The panels the model can mount inside the notch.
 *
 * Each tool's *input* is the payload the client renders — the output is a bare
 * acknowledgement, so the model can carry straight on into its closing sentence without a
 * round-trip to the browser.
 *
 * Descriptions are prescriptive about *when* to call, not just what the tool does: a nano
 * model picks tools off the trigger condition, and a description that only states purpose
 * measurably under-triggers.
 */
const ack = async () => ({ shown: true });

export const flowTools = {
  show_projects: tool({
    description:
      'Show the grid of Jared\'s projects. Call this when the visitor asks to see his work, his projects, his portfolio, what he has built, or what he has shipped. Pass `stack` only when they name a specific technology (e.g. "what has he built in Rust?").',
    inputSchema: z.object({
      stack: z
        .string()
        .optional()
        .describe(
          'A single technology to filter by, e.g. "Rust" or "React". Omit to show everything.'
        ),
    }),
    execute: ack,
  }),

  show_project: tool({
    description:
      'Show one project in detail. Call this whenever the visitor names a specific project, or asks to go deeper on one you just mentioned. The title must match a project title in the dossier exactly.',
    inputSchema: z.object({
      title: z
        .string()
        .describe('Exact project title as written in the dossier, e.g. "Conch".'),
    }),
    execute: ack,
  }),

  show_testimonials: tool({
    description:
      'Show what colleagues have said about working with Jared. Call this when the visitor asks about references, testimonials, reviews, reputation, what he is like to work with, or how he collaborates.',
    inputSchema: z.object({}),
    execute: ack,
  }),

  show_skills: tool({
    description:
      'Show Jared\'s technical stack as clickable chips. Call this when the visitor asks what technologies, languages, frameworks, or tools he uses or knows.',
    inputSchema: z.object({}),
    execute: ack,
  }),

  show_contact: tool({
    description:
      'Show Jared\'s email and social links. Call this when the visitor asks how to reach him, how to get in touch, for his email, or for a specific profile like GitHub or LinkedIn.',
    inputSchema: z.object({}),
    execute: ack,
  }),
};

export type FlowTools = typeof flowTools;
