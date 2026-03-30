"use client";

import { useState } from "react";
import type { Skill, Language } from "@/lib/types";
import SectionWrapper from "./SectionWrapper";

interface SkillsSectionProps {
  skills: Skill[];
  languages: Language[];
  techFilter: string[];
  jobFilter: string[];
  collapsed?: boolean;
  onToggle?: () => void;
  hiddenCategories: string[];
  hiddenKeywords: Record<string, string[]>;
  onToggleCategory: (name: string) => void;
  onToggleKeyword: (category: string, keyword: string) => void;
}

function matchesFilters(item: { categories?: string[]; tags?: string[] }, techFilter: string[], jobFilter: string[]): boolean {
  if (techFilter.length > 0 && (!item.categories || !item.categories.some((c) => techFilter.includes(c)))) return false;
  if (jobFilter.length > 0 && (!item.tags || !item.tags.some((t) => jobFilter.includes(t)))) return false;
  return true;
}

function KeywordChip({ label, hidden, onToggle }: { label: string; hidden: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={`relative inline-block${hidden ? " print:hidden" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={`inline-block px-2 py-0.5 text-xs border rounded cursor-default select-none transition-colors ${
        hidden
          ? "text-gray-400 dark:text-gray-600 border-dashed border-gray-200 dark:border-gray-700 bg-transparent line-through opacity-50"
          : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
      }`}>
        {label}
      </span>
      {hovered && (
        <button
          onClick={onToggle}
          className={`print:hidden absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white leading-none z-10 transition-transform hover:scale-110 ${
            hidden ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
          title={hidden ? "Restore" : "Remove"}
        >
          <span className="text-[8px] font-bold">{hidden ? "+" : "×"}</span>
        </button>
      )}
    </span>
  );
}

export default function SkillsSection({
  skills,
  languages,
  techFilter,
  jobFilter,
  collapsed,
  onToggle,
  hiddenCategories,
  hiddenKeywords,
  onToggleCategory,
  onToggleKeyword,
}: SkillsSectionProps) {
  const filtered = skills.filter((s) => matchesFilters(s, techFilter, jobFilter));
  const showLanguages = jobFilter.length === 0 && techFilter.length === 0;

  if (filtered.length === 0 && !showLanguages && !collapsed) return null;

  return (
    <SectionWrapper title="Skills" collapsed={collapsed} onToggle={onToggle}>
      <div className="space-y-2">
        {filtered.map((skill) => {
          const isCategoryHidden = hiddenCategories.includes(skill.name);
          const hiddenKws = hiddenKeywords[skill.name] ?? [];

          if (isCategoryHidden) {
            return (
              <div key={skill.name} className="print:hidden group relative flex items-center gap-3">
                <div className="absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                  <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                    <button
                      onClick={() => onToggleCategory(skill.name)}
                      className="text-[9px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100"
                    >↩ restore</button>
                  </div>
                </div>
                <span className="text-sm line-through text-gray-400 dark:text-gray-600 opacity-40 w-28 shrink-0">{skill.name}</span>
              </div>
            );
          }

          return (
            <div key={skill.name} className="group relative flex items-start gap-3">
              <div className="print:hidden absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                  <button
                    onClick={() => onToggleCategory(skill.name)}
                    className="text-[9px] text-red-400 hover:text-red-600 dark:hover:text-red-300 whitespace-nowrap"
                  >✕ remove</button>
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-28 shrink-0 pt-0.5">{skill.name}</span>
              <div className="flex flex-wrap gap-1.5">
                {skill.keywords.map((kw) => (
                  <KeywordChip
                    key={kw}
                    label={kw}
                    hidden={hiddenKws.includes(kw)}
                    onToggle={() => onToggleKeyword(skill.name, kw)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {showLanguages && languages.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-28 shrink-0 pt-0.5">Languages</span>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <span key={l.language} className="inline-block px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800">
                  {l.language} ({l.fluency})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
