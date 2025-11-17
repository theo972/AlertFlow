import type { Status } from "../types/ticket-types";

type StatusBadgeProps = {
    status: Status;
};

const statues: Record<
    Status,
    { label: string; classes: string; dotClasses: string }
> = {
    open: {
        label: "Open",
        classes: "border border-sky-500/30 bg-sky-500/10 text-sky-300",
        dotClasses: "bg-sky-400",
    },
    in_progress: {
        label: "In progress",
        classes: "border border-amber-500/30 bg-amber-500/10 text-amber-300",
        dotClasses: "bg-amber-400",
    },
    resolved: {
        label: "Resolved",
        classes: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        dotClasses: "bg-emerald-400",
    },
    closed: {
        label: "Closed",
        classes: "border border-slate-500/30 bg-slate-500/10 text-slate-300",
        dotClasses: "bg-slate-400",
    },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statues[status];
    if (!config) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                {status}
            </span>
        );
    }
    return (
        <span className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium " + config.classes}>
            <span className={"h-1.5 w-1.5 rounded-full " + config.dotClasses}/>
            {config.label}
        </span>
    );
}
