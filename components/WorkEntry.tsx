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
  const isHidden = override?.hidden === true;

  function toggleHidden() {
    onOverride(index, { ...override, hidden: !isHidden });
  }

  if (isHidden) {
    return (
      <div className="print:hidden group relative mb-2 pb-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <div className="print:hidden absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
          <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
            <button onClick={toggleHidden} className="text-[9px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100">↩ restore</button>
          </div>
        </div>
        <span className="text-sm line-through text-gray-400 dark:text-gray-600 opacity-40">{entry.name}, {entry.position}</span>
      </div>
    );
  }

  return (
    <div className="work-entry group relative mb-5 pb-5 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">

      {/* Per-entry controls — floated left, visible on hover */}
      <div className="print:hidden absolute right-full top-0 pr-3 flex flex-col gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
        <div className={`rounded border px-3 py-2 flex flex-col gap-2.5 ${
          hasOverride
            ? "border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-700"
            : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
        }`}>
          {/* Remove */}
          <button
            onClick={toggleHidden}
            className="text-[9px] text-red-400 hover:text-red-600 dark:hover:text-red-300 text-center"
          >✕ remove</button>
          {/* Detail control */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500">detail</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => cycleDetail(-1)}
                disabled={DETAIL_LEVELS.indexOf(detailLevel) === 0}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-25 leading-none px-0.5"
                title="Less detail"
              >−</button>
              <span className="text-[10px] font-mono text-gray-700 dark:text-gray-200 w-16 text-center">{detailLevel}</span>
              <button
                onClick={() => cycleDetail(1)}
                disabled={DETAIL_LEVELS.indexOf(detailLevel) === DETAIL_LEVELS.length - 1}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-25 leading-none px-0.5"
                title="More detail"
              >+</button>
            </div>
          </div>
          {/* Tech control */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500">tech</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => cycleTech(-1)}
                disabled={TECH_LEVELS.indexOf(techLevel) === 0}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-25 leading-none px-0.5"
                title="Less tech detail"
              >−</button>
              <span className="text-[10px] font-mono text-gray-700 dark:text-gray-200 w-11 text-center">{techLevel}</span>
              <button
                onClick={() => cycleTech(1)}
                disabled={TECH_LEVELS.indexOf(techLevel) === TECH_LEVELS.length - 1}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-25 leading-none px-0.5"
                title="More tech detail"
              >+</button>
            </div>
          </div>
          {/* Reset */}
          {hasOverride && (
            <button
              onClick={resetOverride}
              className="text-[9px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 text-center"
              title="Reset to global settings"
            >↺ reset</button>
          )}
        </div>
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
          <span className="text-gray-700 dark:text-gray-300">, {entry.position}</span>
        </p>
        <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
          {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
        </span>
      </div>

      {/* Summary (italic) */}
      {(detailLevel === "standard" || detailLevel === "full") && entry.summary && (
        <p className="mt-0.5 text-sm italic text-gray-700 dark:text-gray-300 leading-snug">{entry.summary}</p>
      )}

      {/* Highlights */}
      {detailLevel === "full" && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-1 list-disc list-outside pl-4">
          {entry.highlights.map((h, i) => (
            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
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
