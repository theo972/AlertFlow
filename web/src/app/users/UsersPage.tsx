import { useEffect, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { Badge } from "../../components/ui/Badge";
import { RowActionsMenu } from "../../components/ui/RowActionsMenu";
import { ActionDeleteContentModal } from "../../components/ui/ActionDeleteContentModal";
import { FilterBar } from "../../components/ui/FilterBar";
import type { DataTableColumn } from "../../types/data-table";
import type { User, UserFormValues } from "./types/user-types";
import { searchUsers, createUser, updateUser, deleteUser } from "./api/user-api";
import { UserFormModal } from "./components/UserFormModal";
import "../../styles/tickets.scss";
import {UserStatusDot} from "./components/UserStatusDot.tsx";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, roleFilter]);
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const filters: Record<string, unknown> = {};

                if (statusFilter !== "All") filters.status = statusFilter;
                if (roleFilter !== "All") filters.role = roleFilter;
                if (search.trim() !== "") filters.search = search.trim();

                const res = await searchUsers({
                    page,
                    perPage,
                    order: "desc",
                    filters,
                });

                setUsers(res.data);
                setTotalItems(res.total);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [page, perPage, search, statusFilter, roleFilter]);
    const activeCount = users.filter((u) => u.status === "Active").length;
    const invitedCount = users.filter((u) => u.status === "Invited").length;
    const disabledCount = users.filter((u) => u.status === "Disabled").length;

    const roles = Array.from(
        new Set(users.flatMap((u) => u.roles ?? []))
    ).filter(Boolean) as string[];

    const toFormValues = (user: User): UserFormValues => ({
        name: user.name,
        email: user.email,
        status: user.status,
    });

    const handleCreateSubmit = async (values: UserFormValues) => {
        const created = await createUser(values);
        if (page === 1) {
            setUsers((prev) => [created, ...prev]);
        }
        setTotalItems((prev) => prev + 1);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = async (id: number, values: UserFormValues) => {
        const updated = await updateUser(id, values);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        setShowEditPopup(false);
        setCurrentUser(null);
    };

    const confirmDeleteUser = async () => {
        if (!currentUser) return;
        await deleteUser(currentUser.id);
        setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
        setTotalItems((prev) => Math.max(0, prev - 1));
        setShowDeletePopup(false);
        setCurrentUser(null);
    };

    const columns: DataTableColumn<User>[] = [
        {
            key: "id",
            header: "#",
            align: "left",
            className: "data-table__cell--muted",
        },
        {
            key: "name",
            header: "Name",
            truncate: true,
            render: (user) => (
                <span className="text-sm font-medium text-slate-100">
                    {user.name}
                </span>
            ),
        },
        {
            key: "email",
            header: "Email",
            className: "data-table__cell--muted",
        },
        {
            key: "roles",
            header: "Roles",
            render: (user) =>
                user.roles && user.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                            <span key={role} className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-200">
                                {role}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-slate-500">—</span>
                ),
        },
        {
            key: "status",
            header: "Status",
            render: (user) => (
                <div className="flex items-center gap-2">
                    <UserStatusDot status={user.status} />
                    <span>{user.status}</span>
                </div>
            ),
        },
        {
            key: "lastActive",
            header: "Last active",
            className: "data-table__cell--muted",
            render: (user) => {
                if (!user.lastActive) {
                    return <span className="text-xs text-slate-500">—</span>;
                }
                const d = new Date(user.lastActive);
                if (isNaN(d.getTime())) return <span>-</span>;
                return (
                    <span>
                        {d.toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                );
            },
        },
        {
            key: "createdAt",
            header: "Created",
            className: "data-table__cell--muted",
            render: (user) => {
                const d = new Date(user.createdAt);
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
            key: "menu",
            header: "",
            align: "right",
            render: (user) => (
                <RowActionsMenu
                    onEdit={() => {
                        setCurrentUser(user);
                        setShowEditPopup(true);
                    }}
                    onDelete={() => {
                        setCurrentUser(user);
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
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="mt-1 py-2 text-sm text-slate-400">
                        <span className="font-semibold text-slate-100">{activeCount}</span>{" "}
                        Active,{" "}
                        <span className="font-semibold text-slate-100">{invitedCount}</span>{" "}
                        Invited,{" "}
                        <span className="font-semibold text-slate-100">{disabledCount}</span>{" "}
                        Disabled (current page).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Create User
                    </button>
                </div>
            </div>

            <div className="block-card">
                <FilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search user name, email or ID..."
                    selects={[
                        {
                            id: "status",
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { value: "All", label: "Status: All" },
                                { value: "Active", label: "Active" },
                                { value: "Invited", label: "Invited" },
                                { value: "Disabled", label: "Disabled" },
                            ],
                        },
                        {
                            id: "role",
                            value: roleFilter,
                            onChange: setRoleFilter,
                            options: [
                                { value: "All", label: "Role: All" },
                                ...roles.map((r) => ({ value: r, label: r })),
                            ],
                        },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={users}
                    getRowId={(row) => String(row.id)}
                    emptyMessage={
                        loading ? "Loading users..." : "No users found with current filters."
                    }
                    pagination={{
                        currentPage: page,
                        totalPages,
                        pageSize: perPage,
                        totalItems,
                        onPageChange: setPage,
                    }}
                />
            </div>

            <UserFormModal
                open={isCreateOpen}
                mode="create"
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />

            {showEditPopup && currentUser && (
                <UserFormModal
                    open={true}
                    mode="edit"
                    initialValues={toFormValues(currentUser)}
                    onCancel={() => {
                        setShowEditPopup(false);
                        setCurrentUser(null);
                    }}
                    onSubmit={(values) => handleEditSubmit(currentUser.id, values)}
                />
            )}

            <ActionDeleteContentModal
                open={showDeletePopup && !!currentUser}
                title="Supprimer cet utilisateur ?"
                label={
                    currentUser
                        ? `Voulez-vous vraiment supprimer "${currentUser.name}" (${currentUser.email}) ?`
                        : ""
                }
                onCancel={() => {
                    setShowDeletePopup(false);
                    setCurrentUser(null);
                }}
                onConfirm={confirmDeleteUser}
            />
        </div>
    );
}
