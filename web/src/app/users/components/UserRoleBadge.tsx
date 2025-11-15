import React from "react";
import {Badge} from "../../../components/ui/Badge.tsx";
import type { UserRole } from "../types/user-types";

type Props = {
    role: UserRole;
};

export function UserRoleBadge({ role }: Props) {
    switch (role) {
        case "Owner":
            return (
                <Badge className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/40">
                    Owner
                </Badge>
            );
        case "Admin":
            return (
                <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    Admin
                </Badge>
            );
        case "Member":
            return (
                <Badge className="bg-slate-700/70 text-slate-200 border border-slate-500/50">
                    Member
                </Badge>
            );
        default:
            return null;
    }
}
