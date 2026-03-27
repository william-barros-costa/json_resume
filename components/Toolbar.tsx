"use client";

import type { CVState, DetailLevel, TechLevel } from "@/lib/types";

const DETAIL_LEVELS: DetailLevel[] = ["compact", "standard", "full"];
const TECH_LEVELS: TechLevel[] = ["none", "names", "purpose", "rationale"];

interface ToolbarProps {
  state: CVState;
  allCategories: string[];
  allJobTags: string[];
  onDetailChange: (level: DetailLevel) => void;
  onTechChange: (level: TechLevel) => void;
  onFilterChange: (filter: string[]) => void;
  onJobFilterChange: (filter: string[]) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex flex-col rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1.5 text-xs text-left transition-colors ${
              value === opt
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Toolbar({
  state,
  allCategories,
  allJobTags,
  onDetailChange,
  onTechChange,
  onFilterChange,
  onJobFilterChange,
  theme,
  onThemeToggle,
}: ToolbarProps) {
  function selectCategory(cat: string) {
    if (state.techFilter.length === 1 && state.techFilter[0] === cat) {
      onFilterChange([]);
    } else {
      onFilterChange([cat]);
    }
  }

  function addCategory(cat: string) {
    if (state.techFilter.includes(cat)) {
      onFilterChange(state.techFilter.filter((c) => c !== cat));
    } else {
      onFilterChange([...state.techFilter, cat]);
    }
  }

  function selectJobTag(tag: string) {
    if (state.jobFilter.length === 1 && state.jobFilter[0] === tag) {
      onJobFilterChange([]);
    } else {
      onJobFilterChange([tag]);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-5">
        <SegmentedControl
          label="Detail"
          options={DETAIL_LEVELS}
          value={state.detailLevel}
          onChange={onDetailChange}
        />

        <SegmentedControl
          label="Tech"
          options={TECH_LEVELS}
          value={state.techLevel}
          onChange={onTechChange}
        />

        {allCategories.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filter</span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => onFilterChange([])}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    state.techFilter.length === 0
                      ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  all
                </button>
                {allCategories.map((cat) => {
                  const active = state.techFilter.includes(cat);
                  return (
                    <span key={cat} className={`flex rounded border overflow-hidden transition-colors ${active ? "border-gray-800 dark:border-gray-300" : "border-gray-200 dark:border-gray-600"}`}>
                      <button
                        onClick={() => selectCategory(cat)}
                        title="Select only this filter"
                        className={`px-2 py-0.5 text-xs transition-colors ${
                          active
                            ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                      <button
                        onClick={() => addCategory(cat)}
                        title={active ? "Remove from selection" : "Add to selection"}
                        className={`px-1.5 py-0.5 text-xs border-l transition-colors ${
                          active
                            ? "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400 hover:bg-gray-600 dark:hover:bg-gray-400"
                            : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      >
                        {active ? "−" : "+"}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Click to select · + to add</p>
          </div>
        )}

        {allJobTags.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roles</span>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => onJobFilterChange([])}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  state.jobFilter.length === 0
                    ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                all
              </button>
              {allJobTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => selectJobTag(tag)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    state.jobFilter.includes(tag)
                      ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onThemeToggle}
          className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "light" ? "☾ Dark" : "☀ Light"}
        </button>

        <button
          onClick={() => window.print()}
          className="w-full px-3 py-1.5 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
