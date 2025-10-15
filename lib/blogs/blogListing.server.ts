// lib/blogs/blogListing.server.ts
import "server-only";
import { cache } from "react";
import { Api } from "@/lib/api/apiLinks";

export const getBlogsData = cache(async (queryParams: any) => {
    const validParams: Record<string, string> = {};
    
    if (queryParams) {
        Object.keys(queryParams).forEach(key => {
            const value = queryParams[key];
            if (typeof value === 'string' && value.trim() !== '') {
                validParams[key] = value;
            }
            else if (typeof value === 'number') {
                validParams[key] = value.toString();
            }
            // Handle string arrays
            else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                validParams[key] = value.join(',');
            }
        });
    }

    const query = Object.keys(validParams).length > 0
        ? "&" + new URLSearchParams(validParams).toString()
        : "";    
    const res = await fetch(`${Api}/blogs-updated?${query}`, {
        next: { revalidate: 7200 },
    });
    
    if (!res.ok) throw new Error("Failed to load blogs");
    return res.json();
});