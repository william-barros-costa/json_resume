"use client";

import type { Education } from "@/lib/types";
import SectionWrapper from "./SectionWrapper";

function formatDate(dateStr: string): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

interface EducationSectionProps {
  education: Education[];
  collapsed?: boolean;
  onToggle?: () => void;
  hiddenIndices: number[];
  onToggleEntry: (i: number) => void;
}

export default function EducationSection({ education, collapsed, onToggle, hiddenIndices, onToggleEntry }: EducationSectionProps) {
  if (education.length === 0) return null;

  const allHidden = education.every((_, i) => hiddenIndices.includes(i));

  return (
    <SectionWrapper title="Education" collapsed={collapsed} muted={allHidden} onToggle={onToggle}>
      {education.map((e, i) => {
        const isHidden = hiddenIndices.includes(i);

        if (isHidden) {
          return (
            <div key={i} className="print:hidden group relative mb-2 last:mb-0">
              <div className="absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                  <button onClick={() => onToggleEntry(i)} className="text-[9px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100">↩ restore</button>
                </div>
              </div>
              <span className="text-sm line-through text-gray-400 dark:text-gray-600 opacity-40">{e.institution}</span>
            </div>
          );
        }

        return (
          <div key={i} className="group relative mb-3 last:mb-0">
            <div className="absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto print:hidden">
              <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                <button onClick={() => onToggleEntry(i)} className="text-[9px] text-red-400 hover:text-red-600 dark:hover:text-red-300">✕ remove</button>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{e.institution}</span>
                <p className="text-sm italic text-gray-600 dark:text-gray-300">
                  {e.studyType} in {e.area}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                {e.endDate ? formatDate(e.endDate) : "Present"}
              </span>
            </div>
          </div>
        );
      })}
    </SectionWrapper>
  );
}
