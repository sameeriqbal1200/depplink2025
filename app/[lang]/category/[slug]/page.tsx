// app/[lang]/category/[slug]/page.tsx
import Landing from "../landing";
import Listing from "../listing";
import { getRequestContext } from "@/lib/request-context";
import { getCategoryData } from "@/lib/categoryPage/category.server";

export default async function CategoryNew({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  // ✅ unwrap route params & search params
  const { deviceType, lang, slugStr, origin } = await getRequestContext();
  const query = await searchParams;

  if (!slugStr || Array.isArray(slugStr)) {
    throw new Error("Invalid slug");
  }

  // ✅ fetch API data server-side
  const categoryData = await getCategoryData(slugStr, lang, query, deviceType);

  const type = categoryData?.type ?? 1;
  if (type === 0) {
    return <Listing data={categoryData} slug={slugStr} lang={lang} deviceType={deviceType} origin={origin} searchParams={query} />;
  }
  return <Landing data={categoryData} slug={slugStr} lang={lang} deviceType={deviceType} origin={origin} searchParams={query} />;
}
