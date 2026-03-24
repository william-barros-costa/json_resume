import type { Basics } from "@/lib/types";

interface HeaderProps {
  basics: Basics;
}

export default function Header({ basics }: HeaderProps) {
  const { name, label, email, phone, url, location, profiles, summary } = basics;

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
      <p className="text-lg text-gray-600 mt-0.5">{label}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
        <a href={`mailto:${email}`} className="hover:text-gray-900 no-print-url">
          {email}
        </a>
        {phone && <span>{phone}</span>}
        {location && (
          <span>
            {location.city}, {location.countryCode}
          </span>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 no-print-url"
          >
            {url.replace(/^https?:\/\//, "")}
          </a>
        )}
        {profiles.map((p) => (
          <a
            key={p.network}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 no-print-url"
          >
            {p.network}
          </a>
        ))}
      </div>

      {summary && (
        <p className="mt-3 text-sm text-gray-700 leading-relaxed max-w-2xl">
          {summary}
        </p>
      )}
    </header>
  );
}
