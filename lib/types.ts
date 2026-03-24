export type DetailLevel = "compact" | "standard" | "full";
export type TechLevel = "none" | "names" | "purpose" | "rationale";

export interface Technology {
  name: string;
  category: string;
  purpose: string;
  rationale: string;
}

export interface WorkEntry {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  technologies: Technology[];
  tags?: string[];
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score?: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Basics {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: {
    city: string;
    countryCode: string;
    region?: string;
  };
  profiles: Profile[];
}

export interface Skill {
  name: string;
  keywords: string[];
}

export interface Language {
  language: string;
  fluency: string;
}

export interface Resume {
  basics: Basics;
  work: WorkEntry[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

export interface EntryOverride {
  detailLevel?: DetailLevel;
  techLevel?: TechLevel;
}

export interface CVState {
  detailLevel: DetailLevel;
  techLevel: TechLevel;
  techFilter: string[];
  jobFilter: string[];
  entryOverrides: Record<number, EntryOverride | null>;
}
