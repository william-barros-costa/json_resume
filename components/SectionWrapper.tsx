interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
        {title}
      </h2>
      <hr className="border-gray-300 mb-4" />
      {children}
    </section>
  );
}
