import type { Skill, Language } from "@/lib/types";
import SectionWrapper from "./SectionWrapper";

interface SkillsSectionProps {
  skills: Skill[];
  languages: Language[];
}

export default function SkillsSection({ skills, languages }: SkillsSectionProps) {
  return (
    <SectionWrapper title="Skills">
      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.name} className="flex gap-2 text-sm">
            <span className="font-medium text-gray-700 w-28 shrink-0">{skill.name}</span>
            <span className="text-gray-600">{skill.keywords.join(", ")}</span>
          </div>
        ))}
        {languages.length > 0 && (
          <div className="flex gap-2 text-sm">
            <span className="font-medium text-gray-700 w-28 shrink-0">Languages</span>
            <span className="text-gray-600">
              {languages.map((l) => `${l.language} (${l.fluency})`).join(", ")}
            </span>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
