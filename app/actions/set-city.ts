// app/actions/set-city.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setCityAction(city: string, path: string = "/") {
    // store for 30 days; tweak as needed
    (await
        // store for 30 days; tweak as needed
        cookies()).set("city", city, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    // if you statically render some routes, you can revalidate them
    revalidatePath(path);
}
