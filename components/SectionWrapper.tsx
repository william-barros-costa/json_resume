"use client";

const ACCENT = "#8B1C1C";
const MUTED = "#a8a8a8";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function SectionWrapper({ title, children, collapsed, onToggle }: SectionWrapperProps) {
  const color = collapsed ? MUTED : ACCENT;

  return (
    <section className={collapsed ? "mb-6 print:hidden" : "mb-6"}>
      <div
        className={onToggle ? "flex items-center gap-3 mb-4 cursor-pointer" : "flex items-center gap-3 mb-4"}
        onClick={onToggle}
        title={onToggle ? (collapsed ? "Click to show" : "Click to hide") : undefined}
      >
        <span className="flex-1 border-t-2 border-dashed transition-colors" style={{ borderColor: color }} />
        <h2
          className="text-xs font-bold uppercase tracking-widest whitespace-nowrap px-1 transition-colors"
          style={{ color }}
        >
          {title}
        </h2>
        <span className="flex-1 border-t-2 border-dashed transition-colors" style={{ borderColor: color }} />
      </div>
      {!collapsed && children}
    </section>
  );
}
