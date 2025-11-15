import React from "react";
import { Badge } from "../../../components/ui/Badge.tsx";
import type {Status} from "../types/ticket-types.ts";

type StatusBadgeProps = {
    status: Status;
};

const STATUS_STYLES: Record<Status, { label: string; classes: string }> = {
    "To Do": {
        label: "To Do",
        classes: "bg-slate-700/80 text-slate-200 border border-slate-500/60",
    },
    "In Progress": {
        label: "In Progress",
        classes: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
    },
    "For Testing": {
        label: "For Testing",
        classes: "bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/30",
    },
    "For Release": {
        label: "For Release",
        classes: "bg-sky-500/10 text-sky-300 border border-sky-500/30",
    },
    Done: {
        label: "Done",
        classes: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    },
    Returned: {
        label: "Returned",
        classes: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
    },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const cfg = STATUS_STYLES[status];
    return <Badge className={cfg.classes}>{cfg.label}</Badge>;
}
