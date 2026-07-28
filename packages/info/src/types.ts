// The contract every wrapper renders. A wrapper is a function of Info → UI.

export interface Profile {
  name: string;
  title: string;
  email: string;
  avatar: string;
}

export interface Hero {
  greeting: string;
  bio: string;
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
