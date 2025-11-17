import { api } from "../../../lib/auth/http";
import type { User, UserFormValues } from "../types/user-types";

export type UserSearchPayload = {
    support: "user";
    page: number;
    perPage: number;
    order: "asc" | "desc";
    filters: Record<string, unknown>;
};

export type UserSearchResponse = {
    data: User[];
    total: number;
};

export async function searchUsers(params: {
    page?: number;
    perPage?: number;
    order?: "asc" | "desc";
    filters?: Record<string, unknown>;
}): Promise<UserSearchResponse> {
    const payload: UserSearchPayload = {
        support: "user",
        page: params.page ?? 1,
        perPage: params.perPage ?? 10,
        order: params.order ?? "desc",
        filters: params.filters ?? {},
    };

    const { data } = await api.post<UserSearchResponse>("/api/search", payload);
    return data;
}

export async function createUser(values: UserFormValues): Promise<User> {
    const { data } = await api.post<User>("/api/users", values);
    return data;
}

export async function updateUser(id: number, values: UserFormValues): Promise<User> {
    const { data } = await api.put<User>(`/api/users/${id}`, values);
    return data;
}

export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`);
}
