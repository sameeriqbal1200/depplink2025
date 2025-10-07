import { get, post } from "@/lib/api/apiCalls";

export async function hyperpayUpdate(orderid: string, paymentid: any) {
    const userOrderDetails: any = await get(`hyperresponse/${orderid}/${paymentid}`)
    if (!userOrderDetails) throw new Error("Failed to load order");
    return {
        userOrderDetails: userOrderDetails,
    };
}

export async function postShipmentLocation(shipmentId: any) {
    const locationData: any = await post(`shipment-tracking/location/${shipmentId}`, {})
    if (!locationData) throw new Error("Failed to load location");
    return {
        locationData: locationData,
    };
}