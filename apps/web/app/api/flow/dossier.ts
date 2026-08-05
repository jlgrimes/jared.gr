import { info } from '@jared/info';

/**
 * Everything the model is allowed to know about Jared, rendered from @jared/info.
 *
 * Built once at module scope and never interpolated with anything volatile — no timestamps,
 * no request ids — so the prompt prefix is byte-stable and the Gateway can cache it.
 * Anything dynamic (the writing style) is appended *after* this block by the route.
 */
const buildDossier = () => {
  const { profile, hero, projects, testimonials, socials, skills } = info;

  const projectLines = projects.map(p => {
    const years = p.endYear ? `${p.year}–${p.endYear}` : `${p.year}`;
    const links = [
      p.url ? `live: ${p.url}` : null,
      p.infoUrl ? `more: ${p.infoUrl}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    return [
      `### ${p.title}`,
      `Company: ${p.company || '—'}${p.team ? ` (team: ${p.team})` : ''}`,
      `Years: ${years}`,
      `Stack: ${p.stack}`,
      links ? `Links: ${links}` : null,
      p.content,
    ]
      .filter(Boolean)
      .join('\n');
  });

  return [
    '# Dossier: Jared Grimes',
    '',
    `Name: ${profile.name}`,
    `Title: ${profile.title}`,
    `Email: ${profile.email}`,
    '',
    '## Bio',
    hero.bio,
    '',
    '## Skills',
    ...skills.map(s => `- ${s.category}: ${s.items}`),
    '',
    '## Projects',
    'These titles are exact. Use them verbatim when calling show_project.',
    '',
    ...projectLines,
    '',
    '## What colleagues say',
    ...testimonials.map(t => `- ${t.role}, ${t.company}: "${t.content}"`),
    '',
    '## Links',
    ...socials.map(s => `- ${s.name}: ${s.url}`),
  ].join('\n');
};

export const DOSSIER = buildDossier();

export const PERSONA = `You are the voice of Jared Grimes's personal website. A visitor — often a recruiter or an engineer — asks about him, and you answer from the dossier below.

Ground rules:
- Answer ONLY from the dossier. Never invent an employer, job title, date, metric, technology, or project.
- If the dossier does not cover it, say so plainly in one sentence and point them at ${info.profile.email}. Do not guess or hedge into a fabrication. This is a real person's job search; a made-up fact is worse than an admission.
- Speak about Jared in the third person. You are the site, not Jared.
- Be brief. Your answer appears in a small floating bar, not a document. Two or three sentences is usually right; never more than a short paragraph.
- Do not use markdown headings, bullet lists, or bold. Plain sentences only.
- Prefer calling a tool over describing what a tool would show. If a visitor asks to see the projects, call show_projects rather than listing them in prose.
- After a tool call, add at most one short sentence of context. The card speaks for itself.`;
