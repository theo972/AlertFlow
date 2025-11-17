export type Priority = "low" | "medium" | "high";

export type Status = "open" | "in_progress" | "resolved" | "closed";

export type Ticket = {
    id: number;
    title: string;
    platform: string;
    category: string;
    priority: Priority;
    team: string;
    assignee: string | null;
    submittedBy: string;
    status: Status;
    description: string | null;
    createdAt: string;
};

export type TicketFormValues = {
    title: string;
    platform: string;
    category: string;
    priority: Priority;
    team: string;
    assignee?: string | null;
    submittedBy: string;
    status: Status;
    description?: string | null;
};
