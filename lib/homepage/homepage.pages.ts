// lib/homepage.pages.ts
import { Api } from "@/lib/api/apiLinks"; // <-- put your Api constant here
import { cacheKey } from "@/app/GlobalVar";

export async function getHomePages(lang: string, deviceType: string) {
    const city = "Jeddah"
    const homepageSectionOne = await fetch(`${Api}homepagelatest-one?lang=${lang}&device_type=${deviceType}&city=${city}&${cacheKey}`, {
        next: { revalidate: 3600 }, // cache for 1 hour
    })
    const homepageSectionTwo = await fetch(`${Api}homepagelatest-two?lang=${lang}&device_type=${deviceType}&city=${city}&${cacheKey}`, {
        next: { revalidate: 3600 }, // cache for 1 hour
    })
    const homepageSectionThree = await fetch(`${Api}homepagelatest-three?lang=${lang}&device_type=${deviceType}&city=${city}&${cacheKey}`, {
        next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!homepageSectionOne.ok || !homepageSectionTwo.ok || !homepageSectionThree.ok) throw new Error("Failed to load HomePage");
    return {
        homepageSectionOne: await homepageSectionOne.json(),
        homepageSectionTwo: await homepageSectionTwo.json(),
        homepageSectionThree: await homepageSectionThree.json(),
    };
}
export async function getLatestCategoryProducts(type: string, rowId: string, city: string) {
    const latestCategoryData = await fetch(`${Api}getlatestcategoryproducts/${type}/${rowId}&city=${city}`, {
        next: { revalidate: 3600 }, // cache for 1 hour
    })
    if (!latestCategoryData) throw new Error("Failed to load data");
    return {
        latestCategoryData: await latestCategoryData.json(),
    };
}
