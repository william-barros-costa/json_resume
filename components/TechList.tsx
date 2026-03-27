import type { Technology, TechLevel } from "@/lib/types";
import TechPill from "./TechPill";

interface TechListProps {
  technologies: Technology[];
  techLevel: TechLevel;
  techFilter: string[];
}

export default function TechList({ technologies, techLevel, techFilter }: TechListProps) {
  if (techLevel === "none" || technologies.length === 0) return null;

  const visible =
    techFilter.length === 0
      ? technologies
      : technologies.filter((t) => techFilter.includes(t.category));

  if (visible.length === 0) return null;

  if (techLevel === "names") {
    return (
      <div className="flex flex-wrap gap-1.5 mt-3">
        {visible.map((t) => (
          <TechPill key={t.name} name={t.name} />
        ))}
      </div>
    );
  }

  return (
    <ul className="mt-3 space-y-2">
      {visible.map((t) => (
        <li key={t.name} className="text-sm">
          <div className="flex items-center gap-2">
            <TechPill name={t.name} />
            {t.purpose && (
              <span className="text-gray-600 dark:text-gray-300">{t.purpose}</span>
            )}
          </div>
          {techLevel === "rationale" && t.rationale && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic pl-2 border-l-2 border-gray-200 dark:border-gray-600">
              {t.rationale}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
