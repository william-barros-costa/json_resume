"use client";

import { useState } from "react";
import type { Skill, Language } from "@/lib/types";
import SectionWrapper from "./SectionWrapper";
import { getTechIcon } from "@/lib/techIcons";

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
  const { path, hex, fillRule } = getTechIcon(label);

  const activeStyle = {
    backgroundColor: `#${hex}18`,
    borderColor: `#${hex}50`,
    color: `#${hex}`,
  };

  return (
    <span
      className={`relative inline-block${hidden ? " print:hidden" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border cursor-default select-none transition-colors ${
          hidden
            ? "text-gray-400 border-dashed border-gray-200 bg-transparent line-through opacity-50"
            : ""
        }`}
        style={hidden ? {} : activeStyle}
      >
        {!hidden && path && (
          <svg
            role="img"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d={path} fillRule={fillRule} />
          </svg>
        )}
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

  const allHidden = !showLanguages && filtered.every((s) => hiddenCategories.includes(s.name));

  return (
    <SectionWrapper title="Skills" collapsed={collapsed} muted={allHidden} onToggle={onToggle}>
      <div className="space-y-2">
        {filtered.map((skill) => {
          const isCategoryHidden = hiddenCategories.includes(skill.name);
          const hiddenKws = hiddenKeywords[skill.name] ?? [];

          if (isCategoryHidden) {
            return (
              <div key={skill.name} className="print:hidden group relative flex items-center gap-3">
                <div className="absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                  <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
                    <button
                      onClick={() => onToggleCategory(skill.name)}
                      className="text-[9px] text-gray-500 hover:text-gray-800"
                    >↩ restore</button>
                  </div>
                </div>
                <span className="text-sm line-through text-gray-400 opacity-40 w-28 shrink-0">{skill.name}</span>
              </div>
            );
          }

          return (
            <div key={skill.name} className="group relative flex items-start gap-3">
              <div className="print:hidden absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
                  <button
                    onClick={() => onToggleCategory(skill.name)}
                    className="text-[9px] text-red-400 hover:text-red-600 whitespace-nowrap"
                  >✕ remove</button>
                </div>
              </div>
              <span className="text-sm text-gray-600 w-28 shrink-0 pt-0.5">{skill.name}</span>
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
            <span className="text-sm text-gray-600 w-28 shrink-0 pt-0.5">Languages</span>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <span key={l.language} className="inline-block px-2 py-0.5 text-xs text-gray-600 border border-gray-300 rounded bg-gray-50">
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
