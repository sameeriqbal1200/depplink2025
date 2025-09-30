import { get,post } from "@/lib/api/apiCalls";

export async function getUserData() {
    const userData: any = await get(`user-orders/${localStorage.getItem('userid')}`)
    if (!userData) throw new Error("Failed to load notifications");
    return {
        userData: userData,
    };
}

export async function getUserOrderDetails(orderid: string) {
    const userOrderDetails: any = await get(`order-detail/${orderid}`)
    if (!userOrderDetails) throw new Error("Failed to load notifications");
    return {
        userOrderDetails: userOrderDetails,
    };
}

export async function getMaintainanceProductDetails(orderid: string) {
    const maintainanceProductDetails: any = await get(`checkmaintenance-product/${orderid}`)
    if (!maintainanceProductDetails) throw new Error("Failed to load notifications");
    return {
        maintainanceProductDetails: maintainanceProductDetails,
    };
}

export async function getDiscountTypeCart() {
    const discountData: any = await get(`getdiscounttype`)
    if (!discountData) throw new Error("Failed to load discount type");
    return {
        discountData: discountData,
    };
}

export async function getUserProfileData() {
    const userData: any = await get(`user/${localStorage.getItem('userid')}`)
    if (!userData) throw new Error("Failed to load user");
    return {
        userData: userData,
    };
}

export async function getWishlist(data:any) {
    const wishlistData: any = await post(`addwishlist`, data)
    if (!wishlistData) throw new Error("Failed to load Wishlist");
    return {
        wishlistData: wishlistData,
    };
}

export async function removeWishlist(data:any) {
    const wishlistData: any = await post(`removewishlist`, data)
    if (!wishlistData) throw new Error("Failed to load Wishlist");
    return {
        wishlistData: wishlistData,
    };
}