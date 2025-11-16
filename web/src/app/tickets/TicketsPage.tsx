import { useMemo, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { PriorityBadge } from "./components/PriorityBadge";
import { StatusBadge } from "./components/StatusBadge";
import { Badge } from "../../components/ui/Badge";
import { RowActionsMenu } from "../../components/ui/RowActionsMenu";
import { ActionDeleteContentModal } from "../../components/ui/ActionDeleteContentModal";
import { FilterBar } from "../../components/ui/FilterBar";
import { TicketFormModal } from "./components/TicketFormModal";
import { TICKETS } from "./types/ticket-mock";
import type { DataTableColumn } from "../../types/data-table";
import type {Priority, Status, Ticket, TicketFormValues} from "./types/ticket-types";
import "../../styles/tickets.scss";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const pendingCount = tickets.filter((ticket) => ticket.status === "To Do").length;
    const inProgressCount = tickets.filter((ticket) => ticket.status === "In Progress",).length;
    const testingCount = tickets.filter((ticket) => ticket.status === "For Testing",).length;
    const releaseCount = tickets.filter((ticket) => ticket.status === "For Release",).length;
    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            if (search && !ticket.title.toLowerCase().includes(search.toLowerCase()) && !ticket.id.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            if (platformFilter !== "All" && ticket.platform !== platformFilter) return false;
            if (categoryFilter !== "All" && ticket.category !== categoryFilter) return false;
            if (priorityFilter !== "All" && ticket.priority !== (priorityFilter as Priority)) return false;
            return !(statusFilter !== "All" && ticket.status !== (statusFilter as Status));
        });
    }, [
        tickets,
        search,
        platformFilter,
        categoryFilter,
        priorityFilter,
        statusFilter,
    ]);
    const platforms = Array.from(new Set(tickets.map((ticket) => ticket.platform)));
    const categories = Array.from(new Set(tickets.map((ticket) => ticket.category)));

    const toFormValues = (ticket: Ticket): TicketFormValues => ({
        title: ticket.title,
        platform: ticket.platform,
        category: ticket.category,
        priority: ticket.priority,
        team: ticket.team,
        assignee: ticket.assignee,
        submittedBy: ticket.submittedBy,
        status: ticket.status,
        description: ticket.description ?? "",
    });

    const handleCreateSubmit = (values: TicketFormValues) => {
        const nextId = String(Math.max(0, ...tickets.map((ticket) => Number(ticket.id) || 0)) + 1,).padStart(3, "0");
        const newTicket: Ticket = {
            id: nextId,
            date: new Date().toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric",}),
            ...values,
        };

        setTickets((prev) => [newTicket, ...prev]);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = (id: string, values: TicketFormValues) => {
        setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, ...values } : ticket)));
        setShowEditPopup(false);
        setCurrentTicket(null);
    };

    const confirmDeleteTicket = () => {
        if (!currentTicket) return;
        setTickets((prev) => prev.filter((ticket) => ticket.id !== currentTicket.id));
        setShowDeletePopup(false);
        setCurrentTicket(null);
    };

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
                <span className="text-sm font-medium text-slate-100">
          {ticket.title}
        </span>
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
            key: "menu",
            header: "",
            align: "right",
            render: (ticket) => (
                <RowActionsMenu
                    onEdit={() => {
                        setCurrentTicket(ticket);
                        setShowEditPopup(true);
                    }}
                    onDelete={() => {
                        setCurrentTicket(ticket);
                        setShowDeletePopup(true);
                    }}
                />
            ),
        },
    ];

    return (
        <div className="h-full w-full text-slate-100">
            <div className="mb-6 flex items-center justify-between gap-4 block-card">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Ticketing</h1>
                    <p className="mt-1 py-2 text-sm text-slate-400">
                        You have{" "}
                        <span className="font-semibold text-slate-100">
              {pendingCount} tickets
            </span>{" "} in{" "}
                        <Badge className="bg-slate-700/80 text-slate-100">To Do</Badge> and{" "}
                        <span className="font-semibold text-slate-100">{inProgressCount}</span>{" "}
                        in{" "}
                        <Badge className="border border-amber-500/30 bg-amber-500/10 text-amber-300">
                            In Progress
                        </Badge>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Also {testingCount}{" "}
                        <Badge className="border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300">
                            For Testing
                        </Badge>{" "}
                        and {releaseCount}{" "}
                        <Badge className="border border-sky-500/30 bg-sky-500/10 text-sky-300">
                            For Release
                        </Badge>
                        .
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium transition hover:bg-slate-800">
                        Get Report
                    </button>
                    <button
                        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Create Ticket
                    </button>
                </div>
            </div>

            <div className="block-card">
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
                        totalItems: tickets.length,
                    }}
                />
            </div>

            <TicketFormModal
                open={isCreateOpen}
                mode="create"
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />

            {showEditPopup && currentTicket && (
                <TicketFormModal
                    open={true}
                    mode="edit"
                    initialValues={toFormValues(currentTicket)}
                    onCancel={() => {
                        setShowEditPopup(false);
                        setCurrentTicket(null);
                    }}
                    onSubmit={(values) => handleEditSubmit(currentTicket.id, values)}
                />
            )}

            <ActionDeleteContentModal
                open={showDeletePopup && !!currentTicket}
                title="Supprimer ce ticket ?"
                label={currentTicket ? `Voulez-vous vraiment supprimer le ticket #${currentTicket.id} – "${currentTicket.title}" ?` : ""}
                onCancel={() => {
                    setShowDeletePopup(false);
                    setCurrentTicket(null);
                }}
                onConfirm={confirmDeleteTicket}
            />
        </div>
    );
}
