import React from "react";
import { Badge } from "../../../components/ui/Badge.tsx";
import type {Priority} from "../types/ticket-types.ts";

type PriorityBadgeProps = {
    priority: Priority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    switch (priority) {
        case "Low":
            return (
                <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Low
                </Badge>
            );
        case "Medium":
            return (
                <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Medium
                </Badge>
            );
        case "High":
            return (
                <Badge className="bg-orange-500/10 text-orange-300 border border-orange-500/30">
                    High
                </Badge>
            );
        case "Urgent":
            return (
                <Badge className="bg-red-500/10 text-red-300 border border-red-500/30">
                    Urgent
                </Badge>
            );
        default:
            return null;
    }
}
