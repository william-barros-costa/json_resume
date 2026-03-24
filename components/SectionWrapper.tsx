const ACCENT = "#8B1C1C";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-1 border-t-2 border-dashed" style={{ borderColor: ACCENT }} />
        <h2
          className="text-xs font-bold uppercase tracking-widest whitespace-nowrap px-1"
          style={{ color: ACCENT }}
        >
          {title}
        </h2>
        <span className="flex-1 border-t-2 border-dashed" style={{ borderColor: ACCENT }} />
      </div>
      {children}
    </section>
  );
}
