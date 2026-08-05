// The contract every wrapper renders. A wrapper is a function of Info → UI.

export interface Profile {
  name: string;
  title: string;
  email: string;
  avatar: string;
}

/**
 * Registers the hero copy can be written in. Mirrors Wispr Flow's writing-style pill —
 * a wrapper can offer the reader a voice, and this is where the words live.
 */
export type BioStyle = 'casual' | 'formal' | 'veryCasual' | 'excited';

export interface Hero {
  greeting: string;
  /** The default voice. Always present; every variant is optional. */
  bio: string;
  /** Same facts, different register. A wrapper falls back to `bio` for anything missing. */
  bioVariants?: Partial<Record<BioStyle, string>>;
}

export interface Project {
  title: string;
  company: string;
  year: number;
  endYear?: number;
  stack: string;
  team: string;
  content: string;
  image: string;
  url: string;
  infoUrl: string;
}

export interface Testimonial {
  role: string;
  company: string;
  content: string;
}

export interface Social {
  id: string;
  name: string;
  url: string;
}

export interface SkillGroup {
  category: string;
  items: string;
}

export interface Info {
  profile: Profile;
  hero: Hero;
  projects: Project[];
  testimonials: Testimonial[];
  socials: Social[];
  skills: SkillGroup[];
}
