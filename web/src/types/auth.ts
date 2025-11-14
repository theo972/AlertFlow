export interface User {
    id: number;
    email: string;
    roles: string[];
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterPayload {
    email: string;
    password: string;
}