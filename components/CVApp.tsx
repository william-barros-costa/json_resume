"use client";

import { useState, useMemo, useEffect } from "react";
import type { Resume, CVState, DetailLevel, TechLevel, EntryOverride, SectionKey } from "@/lib/types";
import { DEFAULT_SECTION_ORDER } from "@/lib/types";
import type { Preset } from "@/lib/presets";
import { DEFAULT_PRESET, PRESETS } from "@/lib/presets";
import Toolbar from "./Toolbar";
import Header from "./Header";
import SectionWrapper from "./SectionWrapper";
import WorkEntryComponent from "./WorkEntry";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import CertificationsSection from "./CertificationsSection";

function initialState(presetName: string | null): CVState {
  const key = presetName && PRESETS[presetName] ? presetName : DEFAULT_PRESET;
  const preset: Preset = PRESETS[key];
  return {
    detailLevel: preset.detailLevel,
    techLevel: preset.techLevel,
    techFilter: preset.techFilter,
    jobFilter: [],
    entryOverrides: {},
    sectionOrder: DEFAULT_SECTION_ORDER,
    hiddenSections: [],
    hiddenCertifications: [],
    hiddenEducation: [],
    hiddenSkillCategories: [],
    hiddenSkillKeywords: {},
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

  function setSectionOrder(order: SectionKey[]) {
    setState((s) => ({ ...s, sectionOrder: order }));
  }

  function toggleCertification(i: number) {
    setState((s) => ({
      ...s,
      hiddenCertifications: s.hiddenCertifications.includes(i)
        ? s.hiddenCertifications.filter((x) => x !== i)
        : [...s.hiddenCertifications, i],
    }));
  }

  function toggleEducation(i: number) {
    setState((s) => ({
      ...s,
      hiddenEducation: s.hiddenEducation.includes(i)
        ? s.hiddenEducation.filter((x) => x !== i)
        : [...s.hiddenEducation, i],
    }));
  }

  function toggleSkillCategory(name: string) {
    setState((s) => ({
      ...s,
      hiddenSkillCategories: s.hiddenSkillCategories.includes(name)
        ? s.hiddenSkillCategories.filter((x) => x !== name)
        : [...s.hiddenSkillCategories, name],
    }));
  }

  function toggleSkillKeyword(category: string, keyword: string) {
    setState((s) => {
      const current = s.hiddenSkillKeywords[category] ?? [];
      const next = current.includes(keyword)
        ? current.filter((k) => k !== keyword)
        : [...current, keyword];
      return { ...s, hiddenSkillKeywords: { ...s.hiddenSkillKeywords, [category]: next } };
    });
  }

  function toggleSection(key: SectionKey) {
    setState((s) => ({
      ...s,
      hiddenSections: s.hiddenSections.includes(key)
        ? s.hiddenSections.filter((k) => k !== key)
        : [...s.hiddenSections, key],
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
          onSectionReorder={setSectionOrder}
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
      </aside>

      <main className="flex-1 flex justify-center px-6 py-8"><div className="w-full max-w-3xl">
        <Header basics={resume.basics} />

        {state.sectionOrder.map((section) => {
          const hidden = state.hiddenSections.includes(section);
          if (section === "skills") return <SkillsSection key="skills" skills={resume.skills} languages={resume.languages} techFilter={state.techFilter} jobFilter={state.jobFilter} collapsed={hidden} onToggle={() => toggleSection("skills")} hiddenCategories={state.hiddenSkillCategories} hiddenKeywords={state.hiddenSkillKeywords} onToggleCategory={toggleSkillCategory} onToggleKeyword={toggleSkillKeyword} />;
          if (section === "certifications") return resume.certifications ? <CertificationsSection key="certifications" certifications={resume.certifications} techFilter={state.techFilter} jobFilter={state.jobFilter} hiddenIndices={state.hiddenCertifications} onToggle={toggleCertification} collapsed={hidden} onToggleSection={() => toggleSection("certifications")} /> : null;
          if (section === "experience") {
            const entries = resume.work
              .map((entry, originalIndex) => ({ entry, originalIndex }))
              .filter(({ entry }) => entry.type !== "academic")
              .filter(({ entry }) => {
                if (state.jobFilter.length === 0) return true;
                if (!entry.tags || entry.tags.length === 0) return true;
                return entry.tags.some((tag) => state.jobFilter.includes(tag));
              });
            return (
              <SectionWrapper key="experience" title="Professional Experience" collapsed={hidden} muted={entries.length === 0} onToggle={() => toggleSection("experience")}>
                {entries.map(({ entry, originalIndex }) => (
                  <WorkEntryComponent
                    key={originalIndex}
                    entry={entry}
                    index={originalIndex}
                    globalDetailLevel={state.detailLevel}
                    globalTechLevel={state.techLevel}
                    techFilter={state.techFilter}
                    override={state.entryOverrides[originalIndex] ?? null}
                    onOverride={setEntryOverride}
                  />
                ))}
              </SectionWrapper>
            );
          }
          if (section === "academic") {
            const entries = resume.work
              .map((entry, originalIndex) => ({ entry, originalIndex }))
              .filter(({ entry }) => entry.type === "academic")
              .filter(({ entry }) => {
                if (state.jobFilter.length === 0) return true;
                if (!entry.tags || entry.tags.length === 0) return true;
                return entry.tags.some((tag) => state.jobFilter.includes(tag));
              });
            return (
              <SectionWrapper key="academic" title="Academic Experience" collapsed={hidden} muted={entries.length === 0} onToggle={() => toggleSection("academic")}>
                {entries.map(({ entry, originalIndex }) => (
                  <WorkEntryComponent
                    key={originalIndex}
                    entry={entry}
                    index={originalIndex}
                    globalDetailLevel={state.detailLevel}
                    globalTechLevel={state.techLevel}
                    techFilter={state.techFilter}
                    override={state.entryOverrides[originalIndex] ?? null}
                    onOverride={setEntryOverride}
                  />
                ))}
              </SectionWrapper>
            );
          }
          if (section === "education") return <EducationSection key="education" education={resume.education} collapsed={hidden} onToggle={() => toggleSection("education")} hiddenIndices={state.hiddenEducation} onToggleEntry={toggleEducation} />;
          return null;
        })}
      </div></main>
    </div>
  );
}
