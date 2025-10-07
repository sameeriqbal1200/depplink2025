import { get } from "../api/apiCalls";


export async function getProductExtraDataRegional(productid: any, city:any, ) {
    const productextradata: any = await get(`productextradata-regional-new/${productid}/${city}`)
    if (!productextradata) throw new Error("Failed to load product extra data");
    return {
        productextradata: productextradata,
    };
}

export async function getPickupFromStoreProduct(sku: any, city:any,lang: any, sqty: any ) {
    const pickupStoreData: any = await get(`pickup-from-store/${sku}/${city}/${localStorage.getItem('globalStore') ? 0 : 0}?lang=${lang}&sortCity=${city}&product_qty=${sqty}`)
    if (!pickupStoreData) throw new Error("Failed to load product extra data");
    return {
        pickupStoreData: pickupStoreData,
    };
}
