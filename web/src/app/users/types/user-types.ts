// src/app/users/types/user-types.ts

export type UserStatus = "Active" | "Invited" | "Disabled";

export type User = {
    id: number;
    email: string;
    name: string;
    permissions: string[];
    roles: string[];
    lastActive: string | null;
    status: UserStatus;
    createdAt: string;
};

export type UserFormValues = {
    name: string;
    email: string;
    status: UserStatus;
    password?: string;
};
