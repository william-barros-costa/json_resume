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
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <SectionWrapper title="Education">
      {education.map((e, i) => (
        <div key={i} className="mb-3 last:mb-0 flex items-baseline justify-between gap-4">
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
      ))}
    </SectionWrapper>
  );
}
