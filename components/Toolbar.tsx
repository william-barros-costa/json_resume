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
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex rounded border border-gray-200 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1 text-xs transition-colors ${
              value === opt
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
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
    <div className="toolbar sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 print:hidden">
      <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-4">
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Filter</span>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => onFilterChange([])}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    state.techFilter.length === 0
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  all
                </button>
                {allCategories.map((cat) => {
                  const active = state.techFilter.includes(cat);
                  return (
                    <span key={cat} className={`flex rounded border overflow-hidden transition-colors ${active ? "border-gray-800" : "border-gray-200"}`}>
                      <button
                        onClick={() => selectCategory(cat)}
                        title="Select only this filter"
                        className={`px-2 py-0.5 text-xs transition-colors ${
                          active
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                      </button>
                      <button
                        onClick={() => addCategory(cat)}
                        title={active ? "Remove from selection" : "Add to selection"}
                        className={`px-1.5 py-0.5 text-xs border-l transition-colors ${
                          active
                            ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                            : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                      >
                        {active ? "−" : "+"}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-400 pl-[3.5rem]">Click to select · + to add</p>
          </div>
        )}

        {allJobTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Roles</span>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => onJobFilterChange([])}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  state.jobFilter.length === 0
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
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
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => window.print()}
          className="ml-auto px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
