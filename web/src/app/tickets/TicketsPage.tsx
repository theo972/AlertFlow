import { useMemo, useState } from "react";
import {DataTable} from "../../components/table/DataTable.tsx";
import {PriorityBadge} from "./components/PriorityBadge.tsx";
import {StatusBadge} from "./components/StatusBadge.tsx";
import {Badge} from "../../components/ui/Badge.tsx";
import {FilterBar} from "../../components/ui/FilterBar.tsx";
import type {DataTableColumn} from "../../types/data-table.ts";
import type {Priority, Status, Ticket} from "./types/ticket-types.ts";
import "../../styles/tickets.scss";

const TICKETS: Ticket[] = [
    {
        id: "001",
        title: "User cannot receive notifications",
        platform: "Indy",
        category: "Bug",
        priority: "High",
        team: "Frontend",
        assignee: "Jane Doe",
        submittedBy: "Jane Doe",
        date: "25 Jun 2025",
        status: "In Progress",
    },
    {
        id: "002",
        title: "Improve ticket search performance",
        platform: "MCC",
        category: "Suggestion",
        priority: "Medium",
        team: "Backend",
        assignee: "John Doe",
        submittedBy: "Jane Doe",
        date: "25 Jun 2025",
        status: "Done",
    },
    {
        id: "003",
        title: "UI glitch on mobile ticket view",
        platform: "ILG",
        category: "Bug",
        priority: "Low",
        team: "Frontend",
        assignee: "Jane Doe",
        submittedBy: "John Doe",
        date: "24 Jun 2025",
        status: "For Release",
    },
    {
        id: "004",
        title: "Add bulk export feature",
        platform: "Zambero",
        category: "Suggestion",
        priority: "Low",
        team: "Backend",
        assignee: "Jane Doe",
        submittedBy: "Jane Doe",
        date: "24 Jun 2025",
        status: "For Testing",
    },
    {
        id: "005",
        title: "Notification email duplicated",
        platform: "Indy",
        category: "Bug",
        priority: "High",
        team: "Frontend",
        assignee: "John Doe",
        submittedBy: "Jane Doe",
        date: "23 Jun 2025",
        status: "Returned",
    },
    {
        id: "006",
        title: "Add custom ticket fields",
        platform: "MCC",
        category: "Suggestion",
        priority: "Medium",
        team: "Backend",
        assignee: "Jane Doe",
        submittedBy: "John Doe",
        date: "22 Jun 2025",
        status: "To Do",
    },
];

export default function TicketsPage() {
    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const pendingCount = TICKETS.filter((t) => t.status === "To Do").length;
    const inProgressCount = TICKETS.filter(
        (t) => t.status === "In Progress"
    ).length;
    const testingCount = TICKETS.filter((t) => t.status === "For Testing").length;
    const releaseCount = TICKETS.filter((t) => t.status === "For Release").length;

    const filteredTickets = useMemo(() => {
        return TICKETS.filter((t) => {
            if (
                search &&
                !t.title.toLowerCase().includes(search.toLowerCase()) &&
                !t.id.toLowerCase().includes(search.toLowerCase())
            ) {
                return false;
            }
            if (platformFilter !== "All" && t.platform !== platformFilter) return false;
            if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
            if (priorityFilter !== "All" && t.priority !== (priorityFilter as Priority))
                return false;
            if (statusFilter !== "All" && t.status !== (statusFilter as Status))
                return false;

            return true;
        });
    }, [search, platformFilter, categoryFilter, priorityFilter, statusFilter]);

    const platforms = Array.from(new Set(TICKETS.map((t) => t.platform)));
    const categories = Array.from(new Set(TICKETS.map((t) => t.category)));

    const columns: DataTableColumn<Ticket>[] = [
        {
            key: "id",
            header: "#",
            align: "left",
            className: "data-table__cell--muted",
        },
        {
            key: "title",
            header: "Title",
            truncate: true,
            render: (ticket) => (
                <span className="text-sm font-medium text-slate-100">{ticket.title}</span>
            ),
        },
        { key: "platform", header: "Platform" },
        { key: "category", header: "Category" },
        {
            key: "priority",
            header: "Priority",
            render: (ticket) => <PriorityBadge priority={ticket.priority} />,
        },
        { key: "team", header: "Team" },
        { key: "assignee", header: "Assignee" },
        {
            key: "submittedBy",
            header: "Submitted by",
            className: "data-table__cell--muted",
        },
        {
            key: "date",
            header: "Date",
            className: "data-table__cell--muted",
        },
        {
            key: "status",
            header: "Status",
            render: (ticket) => <StatusBadge status={ticket.status} />,
        },
        {
            key: "actions",
            header: "…",
            align: "right",
            render: () => (
                <span className="text-xl text-slate-500 select-none">⋯</span>
            ),
        },
    ];

    return (
        <div className="h-full w-full text-slate-100">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 mb-6 block-card">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Ticketing</h1>
                    <p className="mt-1 text-sm text-slate-400 py-2">
                        You have{" "}
                        <span className="font-semibold text-slate-100">{pendingCount} tickets
                        </span>{" "}
                        in{" "}
                        <Badge className="bg-slate-700/80 text-slate-100">To Do</Badge> and{" "}
                        <span className="font-semibold text-slate-100">{inProgressCount}</span>{" "}
                        in{" "}
                        <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30">In Progress</Badge>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Also {testingCount}{" "}
                        <Badge className="bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/30">
                            For Testing
                        </Badge>{" "}
                        and {releaseCount}{" "}
                        <Badge className="bg-sky-500/10 text-sky-300 border border-sky-500/30">
                            For Release
                        </Badge>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium hover:bg-slate-800 transition">
                        Get Report
                    </button>
                    <button className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition">
                        Create Ticket
                    </button>
                </div>
            </div>

            {/* CARD FILTRES + TABLE */}
            <div className="block-card">
                {/* Filtres + search */}
                <FilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search ticket ID or title..."
                    selects={[
                        {
                            id: "platform",
                            value: platformFilter,
                            onChange: setPlatformFilter,
                            options: [
                                { value: "All", label: "Platform: All" },
                                ...platforms.map((p) => ({ value: p, label: p })),
                            ],
                        },
                        {
                            id: "category",
                            value: categoryFilter,
                            onChange: setCategoryFilter,
                            options: [
                                { value: "All", label: "Category: All" },
                                ...categories.map((c) => ({ value: c, label: c })),
                            ],
                        },
                        {
                            id: "priority",
                            value: priorityFilter,
                            onChange: setPriorityFilter,
                            options: [
                                { value: "All", label: "Priority: All" },
                                { value: "Low", label: "Low" },
                                { value: "Medium", label: "Medium" },
                                { value: "High", label: "High" },
                                { value: "Urgent", label: "Urgent" },
                            ],
                        },
                        {
                            id: "status",
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { value: "All", label: "Status: All" },
                                { value: "To Do", label: "To Do" },
                                { value: "In Progress", label: "In Progress" },
                                { value: "For Testing", label: "For Testing" },
                                { value: "For Release", label: "For Release" },
                                { value: "Done", label: "Done" },
                                { value: "Returned", label: "Returned" },
                            ],
                        },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={filteredTickets}
                    getRowId={(row) => row.id}
                    emptyMessage="No tickets found with current filters."
                    pagination={{
                        currentPage: 1,
                        totalPages: 3,
                        pageSize: filteredTickets.length,
                        totalItems: TICKETS.length,
                    }}
                />
            </div>
        </div>
    );
}
