import type { Ticket, TicketFormValues } from "../types/ticket-types";
import { api } from "../../../lib/auth/http";

export type TicketSearchPayload = {
    support: "ticket";
    page: number;
    perPage: number;
    order: "asc" | "desc";
    filters: Record<string, unknown>;
};

export type TicketSearchResponse = {
    data: Ticket[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
};

export async function searchTickets(params: {
    page?: number;
    perPage?: number;
    order?: "asc" | "desc";
    filters?: Record<string, unknown>;
}): Promise<TicketSearchResponse> {
    const payload: TicketSearchPayload = {
        support: "ticket",
        page: params.page ?? 1,
        perPage: params.perPage ?? 10,
        order: params.order ?? "desc",
        filters: params.filters ?? {},
    };

    const { data } = await api.post<TicketSearchResponse>("/api/search", payload);
    return data;
}

export async function createTicket(values: TicketFormValues): Promise<Ticket> {
    const { data } = await api.post<Ticket>("/api/tickets", values);
    return data;
}

export async function updateTicket(id: number, values: TicketFormValues): Promise<Ticket> {
    const { data } = await api.put<Ticket>(`/api/tickets/${id}`, values);
    return data;
}

export async function deleteTicket(id: number): Promise<void> {
    await api.delete(`/api/tickets/${id}`);
}
