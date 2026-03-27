"use client";

import { useState, useMemo, useEffect } from "react";
import type { Resume, CVState, DetailLevel, TechLevel, EntryOverride } from "@/lib/types";
import type { Preset } from "@/lib/presets";
import { DEFAULT_PRESET, PRESETS } from "@/lib/presets";
import Toolbar from "./Toolbar";
import Header from "./Header";
import SectionWrapper from "./SectionWrapper";
import WorkEntryComponent from "./WorkEntry";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";

function initialState(presetName: string | null): CVState {
  const key = presetName && PRESETS[presetName] ? presetName : DEFAULT_PRESET;
  const preset: Preset = PRESETS[key];
  return {
    detailLevel: preset.detailLevel,
    techLevel: preset.techLevel,
    techFilter: preset.techFilter,
    jobFilter: [],
    entryOverrides: {},
  };
}

interface CVAppProps {
  resume: Resume;
  preset: string | null;
}

export default function CVApp({ resume, preset }: CVAppProps) {
  const [state, setState] = useState<CVState>(() => initialState(preset));
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const before = () => document.documentElement.classList.remove("dark");
    const after = () => { if (theme === "dark") document.documentElement.classList.add("dark"); };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, [theme]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const job of resume.work) {
      for (const tech of job.technologies) {
        cats.add(tech.category);
      }
    }
    return Array.from(cats).sort();
  }, [resume.work]);

  const allJobTags = useMemo(() => {
    const tags = new Set<string>();
    for (const job of resume.work) {
      for (const tag of job.tags ?? []) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  }, [resume.work]);

  function setDetailLevel(level: DetailLevel) {
    setState((s) => ({ ...s, detailLevel: level, entryOverrides: {} }));
  }

  function setTechLevel(level: TechLevel) {
    setState((s) => ({ ...s, techLevel: level, entryOverrides: {} }));
  }

  function setTechFilter(filter: string[]) {
    setState((s) => ({ ...s, techFilter: filter }));
  }

  function setJobFilter(filter: string[]) {
    setState((s) => ({ ...s, jobFilter: filter }));
  }

  function setEntryOverride(index: number, override: EntryOverride | null) {
    setState((s) => ({
      ...s,
      entryOverrides: { ...s.entryOverrides, [index]: override },
    }));
  }

  return (
    <div className="flex">
      <aside className="print:hidden sticky top-0 h-screen w-52 shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Toolbar
          state={state}
          allCategories={allCategories}
          allJobTags={allJobTags}
          onDetailChange={setDetailLevel}
          onTechChange={setTechLevel}
          onFilterChange={setTechFilter}
          onJobFilterChange={setJobFilter}
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
      </aside>

      <main className="flex-1 flex justify-center px-6 py-8"><div className="w-full max-w-3xl">
        <Header basics={resume.basics} />

        <SectionWrapper title="Experience">
          {resume.work
            .filter((entry) => {
              if (state.jobFilter.length === 0) return true;
              if (!entry.tags || entry.tags.length === 0) return true;
              return entry.tags.some((tag) => state.jobFilter.includes(tag));
            })
            .map((entry, i) => (
              <WorkEntryComponent
                key={i}
                entry={entry}
                index={i}
                globalDetailLevel={state.detailLevel}
                globalTechLevel={state.techLevel}
                techFilter={state.techFilter}
                override={state.entryOverrides[i] ?? null}
                onOverride={setEntryOverride}
              />
            ))}
        </SectionWrapper>

        <SkillsSection skills={resume.skills} languages={resume.languages} />
        <EducationSection education={resume.education} />
      </div></main>
    </div>
  );
}
