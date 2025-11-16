export type UserRole = "Owner" | "Admin" | "Member";
export type UserStatus = "Active" | "Invited" | "Suspended";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions: string[];
    lastActive: string;
    dateAdded: string;
    status: UserStatus;
};

export type UserFormValues = {
    name: string;
    email: string;
    role: UserRole;
    permissions: string[];
    lastActive: string;
    dateAdded: string;
    status: UserStatus;
};
