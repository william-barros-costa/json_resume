import type { DetailLevel, TechLevel } from "./types";

export interface Preset {
  label: string;
  detailLevel: DetailLevel;
  techLevel: TechLevel;
  techFilter: string[];
}

export const PRESETS: Record<string, Preset> = {
  compact: {
    label: "Compact",
    detailLevel: "compact",
    techLevel: "names",
    techFilter: [],
  },
  standard: {
    label: "Standard",
    detailLevel: "standard",
    techLevel: "purpose",
    techFilter: [],
  },
  detailed: {
    label: "Detailed",
    detailLevel: "full",
    techLevel: "rationale",
    techFilter: [],
  },
};

export const DEFAULT_PRESET = "standard";
