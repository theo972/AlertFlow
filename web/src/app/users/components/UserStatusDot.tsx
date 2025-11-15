import React from "react";
import type { UserStatus } from "../types/user-types";

type Props = {
    status: UserStatus;
};

export function UserStatusDot({ status }: Props) {
    const color =
        status === "Active"
            ? "bg-emerald-400"
            : status === "Invited"
                ? "bg-amber-400"
                : "bg-rose-400";

    return <span className={`h-2 w-2 rounded-full ${color}`} />;
}
