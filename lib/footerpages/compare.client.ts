// import "server-only";
import { get, post } from "@/lib/api/apiCalls";

export async function getCompareDataFunc() {
    const compareData: any = await get(`getcompare/${localStorage.getItem('userid')}`)
    if (!compareData) throw new Error("Failed to load notifications");
    return {
        compareData: compareData,
    };
}

export async function getExtraProductDataFunc(a: any, city: any) {
    const extraProductDataFunc: any = await get(`productextradatamulti-regional-new/${a?.join(",")}/${city}`)
    if (!extraProductDataFunc) throw new Error("Failed to load notifications");
    return {
        extraProductDataFunc: extraProductDataFunc,
    };
}

export async function deleteUserAllCompareData(data: any) {
    const compareResData: any = await post(`removeallcompare`, data)
    if (!compareResData) throw new Error("Failed to load data");
    return {
        compareResData: compareResData,
    };
}

export async function removeUserCompareData(data: any) {
    const userResData: any = await post(`removecompare`, data)
    if (!userResData) throw new Error("Failed to load data");
    return {
        userResData: userResData,
    };
}