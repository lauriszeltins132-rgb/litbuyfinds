import { permanentRedirect } from "next/navigation";

type FindsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FindsPage({ searchParams }: FindsPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }

  const qs = query.toString();
  permanentRedirect(qs ? `/?${qs}` : "/");
}
