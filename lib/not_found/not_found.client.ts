import { get } from "@/lib/api/apiCalls";

export async function getPushMessageData(preRoute: any) {
    const pushErrorData: any = await get(`push-error-alert-message-team?pre_route=${preRoute}`)
    if (!pushErrorData) throw new Error("Failed to load pushErrorData");
    return {
        pushErrorData: pushErrorData,
    };
}