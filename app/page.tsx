import resume from "@/lib/resume";
import CVApp from "@/components/CVApp";

interface PageProps {
  searchParams: Promise<{ preset?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <CVApp resume={resume} preset={params.preset ?? null} />;
}
