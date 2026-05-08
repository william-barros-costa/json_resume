import { getTechIcon } from "@/lib/techIcons";

interface TechPillProps {
  name: string;
}

export default function TechPill({ name }: TechPillProps) {
  const { path, hex, fillRule } = getTechIcon(name);

  const style = {
    backgroundColor: `#${hex}18`,
    borderColor: `#${hex}50`,
    color: `#${hex}`,
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border"
      style={style}
    >
      {path && (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d={path} fillRule={fillRule} />
        </svg>
      )}
      {name}
    </span>
  );
}
