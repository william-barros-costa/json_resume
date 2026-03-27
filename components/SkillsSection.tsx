import type { Skill, Language } from "@/lib/types";
import SectionWrapper from "./SectionWrapper";

interface SkillsSectionProps {
  skills: Skill[];
  languages: Language[];
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800">
      {label}
    </span>
  );
}

export default function SkillsSection({ skills, languages }: SkillsSectionProps) {
  return (
    <SectionWrapper title="Skills">
      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-start gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-28 shrink-0 pt-0.5">{skill.name}</span>
            <div className="flex flex-wrap gap-1.5">
              {skill.keywords.map((kw) => (
                <Chip key={kw} label={kw} />
              ))}
            </div>
          </div>
        ))}
        {languages.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-28 shrink-0 pt-0.5">Languages</span>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <Chip key={l.language} label={`${l.language} (${l.fluency})`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
