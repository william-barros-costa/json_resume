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
        <div key={i} className="mb-3 last:mb-0">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold text-gray-900">{e.institution}</h3>
            <span className="text-xs text-gray-500">
              {formatDate(e.startDate)} – {formatDate(e.endDate)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {e.studyType} in {e.area}
            {e.score && <span className="ml-2 text-gray-400">· {e.score}</span>}
          </p>
        </div>
      ))}
    </SectionWrapper>
  );
}
