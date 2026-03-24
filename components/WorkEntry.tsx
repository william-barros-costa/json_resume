"use client";

import type { WorkEntry as WorkEntryType, DetailLevel, TechLevel, EntryOverride, CVState } from "@/lib/types";
import TechList from "./TechList";

const ACCENT = "#8B1C1C";
const DETAIL_LEVELS: DetailLevel[] = ["compact", "standard", "full"];
const TECH_LEVELS: TechLevel[] = ["none", "names", "purpose", "rationale"];

function formatDate(dateStr: string): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

interface WorkEntryProps {
  entry: WorkEntryType;
  index: number;
  globalDetailLevel: CVState["detailLevel"];
  globalTechLevel: CVState["techLevel"];
  techFilter: CVState["techFilter"];
  override: EntryOverride | null;
  onOverride: (index: number, override: EntryOverride | null) => void;
}

export default function WorkEntryComponent({
  entry,
  index,
  globalDetailLevel,
  globalTechLevel,
  techFilter,
  override,
  onOverride,
}: WorkEntryProps) {
  const detailLevel: DetailLevel = override?.detailLevel ?? globalDetailLevel;
  const techLevel: TechLevel = override?.techLevel ?? globalTechLevel;

  function cycleDetail(direction: 1 | -1) {
    const current = DETAIL_LEVELS.indexOf(detailLevel);
    const next = DETAIL_LEVELS[current + direction];
    if (!next) return;
    onOverride(index, { ...override, detailLevel: next });
  }

  function cycleTech(direction: 1 | -1) {
    const current = TECH_LEVELS.indexOf(techLevel);
    const next = TECH_LEVELS[current + direction];
    if (next === undefined) return;
    onOverride(index, { ...override, techLevel: next });
  }

  function resetOverride() {
    onOverride(index, null);
  }

  const hasOverride =
    override?.detailLevel !== undefined || override?.techLevel !== undefined;

  return (
    <div className="work-entry mb-5 pb-5 border-b border-gray-100 last:border-0 last:pb-0">

      {/* Per-entry controls (hidden on print) */}
      <div className="flex items-center justify-end gap-1 print:hidden mb-1">
        {hasOverride && (
          <button
            onClick={resetOverride}
            className="text-xs text-gray-400 hover:text-gray-600 px-1"
            title="Reset to global settings"
          >
            ↺
          </button>
        )}
        <span className="text-xs text-gray-400">detail:</span>
        <button
          onClick={() => cycleDetail(-1)}
          disabled={DETAIL_LEVELS.indexOf(detailLevel) === 0}
          className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 px-0.5"
          title="Less detail"
        >
          −
        </button>
        <span className="text-xs font-mono text-gray-500 w-14 text-center">{detailLevel}</span>
        <button
          onClick={() => cycleDetail(1)}
          disabled={DETAIL_LEVELS.indexOf(detailLevel) === DETAIL_LEVELS.length - 1}
          className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 px-0.5"
          title="More detail"
        >
          +
        </button>
        <span className="text-xs text-gray-400 ml-2">tech:</span>
        <button
          onClick={() => cycleTech(-1)}
          disabled={TECH_LEVELS.indexOf(techLevel) === 0}
          className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 px-0.5"
          title="Less tech detail"
        >
          −
        </button>
        <span className="text-xs font-mono text-gray-500 w-16 text-center">{techLevel}</span>
        <button
          onClick={() => cycleTech(1)}
          disabled={TECH_LEVELS.indexOf(techLevel) === TECH_LEVELS.length - 1}
          className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 px-0.5"
          title="More tech detail"
        >
          +
        </button>
      </div>

      {/* Company + position + date */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm">
          <span className="font-bold" style={{ color: ACCENT }}>
            {entry.url ? (
              <a href={entry.url} target="_blank" rel="noopener noreferrer" className="no-print-url hover:opacity-75">
                {entry.name}
              </a>
            ) : (
              entry.name
            )}
          </span>
          <span className="text-gray-700">, {entry.position}</span>
        </p>
        <span className="text-sm text-gray-500 shrink-0">
          {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
        </span>
      </div>

      {/* Summary (italic) */}
      {(detailLevel === "standard" || detailLevel === "full") && entry.summary && (
        <p className="mt-0.5 text-sm italic text-gray-700 leading-snug">{entry.summary}</p>
      )}

      {/* Highlights */}
      {detailLevel === "full" && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-1 list-disc list-outside pl-4">
          {entry.highlights.map((h, i) => (
            <li key={i} className="text-sm text-gray-700 leading-snug">
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* Technologies */}
      <TechList
        technologies={entry.technologies}
        techLevel={techLevel}
        techFilter={techFilter}
      />
    </div>
  );
}
