import {api} from "./http.ts";
import type {LoginResponse, RegisterPayload} from "../../types/auth.ts";

export async function loginRequest(username: string, password: string) {
    const res = await api.post<LoginResponse>("/auth/login_check", { username, password });
    return res.data;
}

export async function registerRequest(payload: RegisterPayload): Promise<void> {
    await api.post("/auth/register", payload);
}