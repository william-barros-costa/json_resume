import type { Technology, TechLevel } from "@/lib/types";

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
      <div className="flex flex-wrap gap-1.5 mt-2">
        {visible.map((t) => (
          <span
            key={t.name}
            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200"
          >
            {t.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className="mt-2 space-y-2">
      {visible.map((t) => (
        <li key={t.name} className="text-sm">
          <span className="font-medium text-gray-800">{t.name}</span>
          {t.purpose && (
            <span className="text-gray-600"> — {t.purpose}</span>
          )}
          {techLevel === "rationale" && t.rationale && (
            <p className="mt-0.5 text-xs text-gray-500 italic pl-2 border-l-2 border-gray-200">
              {t.rationale}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
