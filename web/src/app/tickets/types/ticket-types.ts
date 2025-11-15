export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type Status =
    | "To Do"
    | "In Progress"
    | "For Testing"
    | "For Release"
    | "Done"
    | "Returned";

export type Ticket = {
    id: string;
    title: string;
    platform: string;
    category: string;
    priority: Priority;
    team: string;
    assignee: string;
    submittedBy: string;
    date: string;
    status: Status;
};