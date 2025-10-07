import { cache } from "react";
import { Api } from "@/lib/api/apiLinks";
import { cacheKey } from "@/app/GlobalVar";

export const getSearchData = cache(
    async (queryParams?: Record<string, any>) => {
        // const cookieStore = await cookies();
        const city = 'Jeddah';
        const query =
            queryParams && Object.keys(queryParams).length > 0
                ? "?" + new URLSearchParams(queryParams).toString()
                : "";
        const searchData = await fetch(`${Api}searchpage-regional-new/${city}${query}`);
        if (!searchData.ok) {
            throw new Error("Failed to load product data");
        }
        return searchData.json();
    }
);

export const getSearchsData = cache(
    async (queryParams?: Record<string, any>) => {
        // const cookieStore = await cookies();
        const city = 'Jeddah';
        const query =
            queryParams && Object.keys(queryParams).length > 0
                ? "?" + new URLSearchParams(queryParams).toString()
                : "";
        const searchData = await fetch(`${Api}searchpage-regional-new/${city}${query}`);
        if (!searchData.ok) {
            throw new Error("Failed to load product data");
        }
        return searchData.json();
    }
);