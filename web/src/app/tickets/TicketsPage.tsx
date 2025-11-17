import { useEffect, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { PriorityBadge } from "./components/PriorityBadge";
import { StatusBadge } from "./components/StatusBadge";
import { Badge } from "../../components/ui/Badge";
import { RowActionsMenu } from "../../components/ui/RowActionsMenu";
import { ActionDeleteContentModal } from "../../components/ui/ActionDeleteContentModal";
import { FilterBar } from "../../components/ui/FilterBar";
import { TicketFormModal } from "./components/TicketFormModal";
import type { DataTableColumn } from "../../types/data-table";
import type { Priority, Status, Ticket, TicketFormValues } from "./types/ticket-types";
import { searchTickets, createTicket, updateTicket, deleteTicket } from "./api/ticket-api";
import "../../styles/tickets.scss";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);

    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    useEffect(() => {
        setPage(1);
    }, [search, platformFilter, categoryFilter, priorityFilter, statusFilter]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const filters: Record<string, unknown> = {};
                if (platformFilter !== "All") filters.platform = platformFilter;
                if (categoryFilter !== "All") filters.category = categoryFilter;
                if (priorityFilter !== "All") filters.priority = priorityFilter;
                if (statusFilter !== "All") filters.status = statusFilter;
                if (search.trim() !== "") filters.title = search.trim();
                const res = await searchTickets({
                    page,
                    perPage,
                    order: "desc",
                    filters,
                });

                setTickets(res.data);
                setTotalItems(res.total);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page, perPage, search, platformFilter, categoryFilter, priorityFilter, statusFilter]);

    const pendingCount = tickets.filter((t) => t.status === "open").length;
    const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
    const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
    const closedCount = tickets.filter((t) => t.status === "closed").length;
    const platforms = Array.from(new Set(tickets.map((ticket) => ticket.platform)));
    const categories = Array.from(new Set(tickets.map((ticket) => ticket.category)));

    const toFormValues = (ticket: Ticket): TicketFormValues => ({
        title: ticket.title,
        platform: ticket.platform,
        category: ticket.category,
        priority: ticket.priority,
        team: ticket.team,
        assignee: ticket.assignee ?? "",
        submittedBy: ticket.submittedBy,
        status: ticket.status,
        description: ticket.description ?? "",
    });

    const handleCreateSubmit = async (values: TicketFormValues) => {
        const created = await createTicket(values);
        if (page === 1) {
            setTickets((prev) => [created, ...prev]);
        }
        setTotalItems((prev) => prev + 1);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = async (id: number, values: TicketFormValues) => {
        const updated = await updateTicket(id, values);
        setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
        setShowEditPopup(false);
        setCurrentTicket(null);
    };

    const confirmDeleteTicket = async () => {
        if (!currentTicket) return;
        await deleteTicket(currentTicket.id);
        setTickets((prev) => prev.filter((ticket) => ticket.id !== currentTicket.id));
        setTotalItems((prev) => Math.max(0, prev - 1));
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
            key: "createdAt",
            header: "Date",
            className: "data-table__cell--muted",
            render: (ticket) => {
                const d = new Date(ticket.createdAt);
                if (isNaN(d.getTime())) return <span>-</span>;
                return (
                    <span>
                        {d.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                );
            },
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
                        </span>{" "}
                        in{" "}
                        <Badge className="bg-slate-700/80 text-slate-100">Open</Badge> and{" "}
                        <span className="font-semibold text-slate-100">{inProgressCount}</span>{" "}
                        in{" "}
                        <Badge className="border border-amber-500/30 bg-amber-500/10 text-amber-300">
                            In&nbsp;progress
                        </Badge>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Also {resolvedCount}{" "}
                        <Badge className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                            Resolved
                        </Badge>{" "}
                        and {closedCount}{" "}
                        <Badge className="border border-slate-500/30 bg-slate-500/10 text-slate-300">
                            Closed
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
                                { value: "low", label: "low" },
                                { value: "medium", label: "medium" },
                                { value: "high", label: "high" },
                            ],
                        },
                        {
                            id: "status",
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { value: "All", label: "Status: All" },
                                { value: "open", label: "open" },
                                { value: "in_progress", label: "in_progress" },
                                { value: "resolved", label: "resolved" },
                                { value: "closed", label: "closed" },
                            ],
                        },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={tickets}
                    getRowId={(row) => String(row.id)}
                    emptyMessage={loading ? "Loading tickets..." : "No tickets found with current filters."}
                    pagination={{
                        currentPage: page,
                        totalPages,
                        pageSize: perPage,
                        totalItems,
                        onPageChange: setPage,
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
