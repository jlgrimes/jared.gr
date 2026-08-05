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
    'These titles are exact. Use them verbatim.',
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
- Your answer renders as plain text in a chat bubble. No markdown at all — no headings, no bullet lists, no bold, no [links](...). Write URLs bare, like conch.so, and only when the visitor would actually want to click.
- Be brief. Two to four sentences answers most questions. Go longer only when genuinely asked to go deep on something.
- When several projects are relevant, name them in a sentence with a clause each rather than enumerating them. "He built Conch, a memory engine for AI agents, and Gen, a Markdown-like notation system for sheet music" — not a list.
- Answer the question that was asked. Don't append an offer to show more unless it's the natural next thing.`;
