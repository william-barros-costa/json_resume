"use client";

import type { Certification } from "@/lib/types";
import SectionWrapper from "./SectionWrapper";

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

interface CertificationsSectionProps {
  certifications: Certification[];
  techFilter: string[];
  jobFilter: string[];
  hiddenIndices: number[];
  onToggle: (i: number) => void;
  collapsed?: boolean;
  onToggleSection?: () => void;
}

export default function CertificationsSection({ certifications, techFilter, jobFilter, hiddenIndices, onToggle, collapsed, onToggleSection }: CertificationsSectionProps) {
  const filtered = certifications
    .map((c, originalIndex) => ({ c, originalIndex }))
    .filter(({ c }) => {
      if (techFilter.length > 0 && (!c.categories || !c.categories.some((cat) => techFilter.includes(cat)))) return false;
      if (jobFilter.length > 0 && (!c.tags || !c.tags.some((t) => jobFilter.includes(t)))) return false;
      return true;
    });

  const allHidden = filtered.every(({ originalIndex }) => hiddenIndices.includes(originalIndex));
  if (filtered.length === 0 || allHidden) return null;

  return (
    <SectionWrapper title="Certifications" collapsed={collapsed} onToggle={onToggleSection}>
      {filtered.map(({ c, originalIndex }) => {
        const isHidden = hiddenIndices.includes(originalIndex);

        if (isHidden) {
          return (
            <div key={originalIndex} className="print:hidden group relative mb-2 last:mb-0">
              <div className="absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                  <button onClick={() => onToggle(originalIndex)} className="text-[9px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100">↩ restore</button>
                </div>
              </div>
              <span className="text-sm line-through text-gray-400 dark:text-gray-600 opacity-40">{c.name}</span>
            </div>
          );
        }

        return (
          <div key={originalIndex} className="group relative mb-3 last:mb-0">
            <div className="absolute right-full top-0 pr-3 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto print:hidden">
              <div className="rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                <button onClick={() => onToggle(originalIndex)} className="text-[9px] text-red-400 hover:text-red-600 dark:hover:text-red-300">✕ remove</button>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    {c.name}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.name}</span>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300">{c.issuer}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{formatDate(c.date)}</span>
            </div>
          </div>
        );
      })}
    </SectionWrapper>
  );
}
