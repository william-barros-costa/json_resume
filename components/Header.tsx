import type { Basics } from "@/lib/types";

const ACCENT = "#8B1C1C";

interface HeaderProps {
  basics: Basics;
}

export default function Header({ basics }: HeaderProps) {
  const { name, label, email, url, profiles, summary } = basics;

  const contactItems = [
    email && (
      <a key="email" href={`mailto:${email}`} className="hover:opacity-70 no-print-url">
        {email}
      </a>
    ),
    url && (
      <a key="url" href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 no-print-url">
        {url.replace(/^https?:\/\//, "")}
      </a>
    ),
    ...profiles.map((p) => (
      <a key={p.network} href={p.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 no-print-url">
        {p.network}
      </a>
    )),
  ].filter(Boolean);

  return (
    <header className="mb-6 text-center">
      <h1
        className="font-bold leading-tight mb-1"
        style={{ fontFamily: "var(--font-serif)", fontSize: "2.75rem", color: ACCENT }}
      >
        {name}
      </h1>

      <p className="text-xs tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-2">
        · {label} ·
      </p>

      <div className="flex flex-wrap justify-center items-center gap-x-1 text-sm text-gray-600 dark:text-gray-300">
        {contactItems.map((item, i) => (
          <span key={i} className="flex items-center gap-x-1">
            {i > 0 && <span className="text-gray-400 dark:text-gray-500 select-none">|</span>}
            {item}
          </span>
        ))}
      </div>

      {summary && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
          {summary}
        </p>
      )}
    </header>
  );
}
