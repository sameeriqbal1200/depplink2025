import { post } from "@/lib/api/apiCalls";

export async function postInternalTicketData(data: any) {
    const ticketData: any = await post(`internal-ticket-save`, data)
    if (!ticketData) throw new Error("Failed to load ticket");
    return {
        userTicketData: ticketData,
    };
}

export async function postCheckUserTicket(data: any) {
    const checkUserTicket: any = await post(`ticket-usercheck`, data)
    if (!checkUserTicket) throw new Error("Failed to load ticket");
    return {
        checkUserTicket: checkUserTicket,
    };
}

export async function postTicketArea(data: any) {
    const areaTicketData: any = await post(`create-ticket-area`, data)
    if (!areaTicketData) throw new Error("Failed to load ticket");
    return {
        areaTicketData: areaTicketData,
    };
}