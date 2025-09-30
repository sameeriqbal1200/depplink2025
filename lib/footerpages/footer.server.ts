// lib/faqs.server.ts (App Router, server-only)
import "server-only";
import { cache } from "react";
import { Api } from "@/lib/api/apiLinks";

export const getFooterServerSidePages = cache(async (slug: string) => {
    const res = await fetch(`${Api}footer_pages/${slug}`, {
        next: { revalidate: 7200 },
    });
    if (!res.ok) throw new Error("Failed to load Footer Pages data");
    return res.json();
});


export const getMaintenanceLocator = cache(async (lang: string) => {
    const res = await fetch(`${Api}get-maintenance-locater?lang=${lang}`, {
        next: { revalidate: 7200 },
    });
    if (!res.ok) throw new Error("Failed to load Maintenance Locator data");
    return res.json();
});
