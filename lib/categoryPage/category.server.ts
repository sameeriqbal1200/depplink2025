// import "server-only";
// lib/categoryPage/category.server.ts

import { cache } from "react";
import { Api } from "@/lib/api/apiLinks";
import { cacheKey } from "@/app/GlobalVar";

export const getCategoryData = cache(
    async (slugStr: string, lang: string, queryParams?: Record<string, any>, deviceType?: string) => {
        // const cookieStore = await cookies();
        const city = 'Jeddah';
        const query =
            queryParams && Object.keys(queryParams).length > 0
                ? "&" + new URLSearchParams(queryParams).toString()
                : "";
        const categoryData = await fetch(`${Api}category-page-data-new/${slugStr}/${city}?v=${cacheKey}&lang=${lang}&${query}&device_type=${deviceType}`, { next: { revalidate: 3600 } });
        if (!categoryData.ok) {
            throw new Error("Failed to load product data");
        }
        return categoryData.json();
    }
);

export const getCategoriesListingData = cache(
    async (lang: string) => {
        const categoriesMobileData = await fetch(`${Api}mob-cat-listing?lang=${lang}&v=${cacheKey}`, { next: { revalidate: 3600 } });
        if (!categoriesMobileData.ok) {
            throw new Error("Failed to load categories listing data");
        }
        return categoriesMobileData.json();
    }
);