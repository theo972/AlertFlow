import { useMemo, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { Badge } from "../../components/ui/Badge";
import { RowActionsMenu } from "../../components/ui/RowActionsMenu";
import { ActionDeleteContentModal } from "../../components/ui/ActionDeleteContentModal";
import { FilterBar } from "../../components/ui/FilterBar";
import { UserRoleBadge } from "./components/UserRoleBadge";
import { UserStatusDot } from "./components/UserStatusDot";
import { UserFormModal } from "./components/UserFormModal";
import { USERS } from "./types/user-mock";
import type { DataTableColumn } from "../../types/data-table";
import type {
    User,
    UserFormValues,
    UserRole,
    UserStatus,
} from "./types/user-types";
import "../../styles/users.scss";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(USERS);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
    const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const totalUsers = users.length;
    const activeCount = users.filter((user) => user.status === "Active").length;
    const invitedCount = users.filter((user) => user.status === "Invited").length;
    const suspendedCount = users.filter((user) => user.status === "Suspended").length;

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            if (
                search &&
                !user.name.toLowerCase().includes(search.toLowerCase()) &&
                !user.email.toLowerCase().includes(search.toLowerCase())
            ) {
                return false;
            }
            if (roleFilter !== "All" && user.role !== roleFilter) return false;
            if (statusFilter !== "All" && user.status !== statusFilter) return false;
            return true;
        });
    }, [users, search, roleFilter, statusFilter]);

    const toFormValues = (user: User): UserFormValues => ({
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        lastActive: user.lastActive,
        dateAdded: user.dateAdded,
        status: user.status,
    });

    const handleCreateSubmit = (values: UserFormValues) => {
        const nextId = String(
            Math.max(0, ...users.map((user) => Number(user.id) || 0)) + 1,
        );

        const newUser: User = {
            id: nextId,
            ...values,
        };

        setUsers((prev) => [newUser, ...prev]);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = (id: string, values: UserFormValues) => {
        setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...values } : user)));
        setShowEditPopup(false);
        setCurrentUser(null);
    };

    const confirmDeleteUser = () => {
        if (!currentUser) return;
        setUsers((prev) => prev.filter((user) => user.id !== currentUser.id));
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
            header: "User name",
            truncate: true,
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="users-avatar">
            <span className="users-avatar-initial">
              {user.name.charAt(0)}
            </span>
                    </div>
                    <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-100">
              {user.name}
            </span>
                        <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "access",
            header: "Access",
            render: (user) => (
                <div className="flex flex-wrap items-center gap-1.5">
                    <UserRoleBadge role={user.role} />
                    {user.permissions.map((permission) => (
                        <Badge
                            key={permission}
                            className="border border-slate-600/70 bg-slate-800/80 text-slate-200"
                        >
                            {permission}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: "lastActive",
            header: "Last active",
            className: "data-table__cell--muted",
            render: (user) => (
                <div className="flex items-center gap-2">
                    <UserStatusDot status={user.status} />
                    <span>{user.lastActive}</span>
                </div>
            ),
        },
        {
            key: "dateAdded",
            header: "Date added",
            className: "data-table__cell--muted",
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
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between gap-4 block-card">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="mt-1 py-2 text-sm text-slate-400">
                        All users{" "}
                        <span className="font-semibold text-slate-100">
              {totalUsers}
            </span>
                        . Active{" "}
                        <Badge className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                            {activeCount} active
                        </Badge>{" "}
                        ·{" "}
                        <Badge className="border border-amber-500/40 bg-amber-500/10 text-amber-300">
                            {invitedCount} invited
                        </Badge>{" "}
                        ·{" "}
                        <Badge className="border border-rose-500/40 bg-rose-500/10 text-rose-300">
                            {suspendedCount} suspended
                        </Badge>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium transition hover:bg-slate-800">
                        Export
                    </button>
                    <button
                        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Invite user
                    </button>
                </div>
            </div>

            <div className="block-card">
                <FilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search name or email..."
                    selects={[
                        {
                            id: "role",
                            value: roleFilter,
                            onChange: (v) => setRoleFilter(v as any),
                            options: [
                                { value: "All", label: "All roles" },
                                { value: "Owner", label: "Owner" },
                                { value: "Admin", label: "Admin" },
                                { value: "Member", label: "Member" },
                            ],
                        },
                        {
                            id: "status",
                            value: statusFilter,
                            onChange: (v) => setStatusFilter(v as any),
                            options: [
                                { value: "All", label: "All status" },
                                { value: "Active", label: "Active" },
                                { value: "Invited", label: "Invited" },
                                { value: "Suspended", label: "Suspended" },
                            ],
                        },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    getRowId={(row) => row.id}
                    emptyMessage="No users found with current filters."
                    pagination={{
                        currentPage: 1,
                        totalPages: 3,
                        pageSize: filteredUsers.length,
                        totalItems: users.length,
                    }}
                />
            </div>

            {/* Modal création */}
            <UserFormModal
                open={isCreateOpen}
                mode="create"
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />

            {/* Modal édition */}
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

            {/* Confirm delete */}
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
