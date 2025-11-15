import {JSX, useMemo, useState} from "react";
import "../../styles/users.scss";
import { DataTable } from "../../components/table/DataTable";
import { Badge } from "../../components/ui/Badge";
import {FilterBar} from "../../components/ui/FilterBar.tsx";
import type {User, UserRole, UserStatus} from "./types/user-types.ts";
import {UserRoleBadge} from "./components/UserRoleBadge.tsx";
import {UserStatusDot} from "./components/UserStatusDot.tsx";
import type {DataTableColumn} from "../../types/data-table.ts";


const USERS: User[] = [
    {
        id: "1",
        name: "Florence Shaw",
        email: "florence@untitledui.com",
        role: "Owner",
        permissions: ["Admin", "Data Export", "Data Import"],
        lastActive: "Mar 4, 2024",
        dateAdded: "Jul 4, 2022",
        status: "Active",
    },
    {
        id: "2",
        name: "Amélie Laurent",
        email: "amelie@untitledui.com",
        role: "Admin",
        permissions: ["Data Export", "Data Import"],
        lastActive: "Mar 4, 2024",
        dateAdded: "Jul 4, 2022",
        status: "Active",
    },
    {
        id: "3",
        name: "Ammar Foley",
        email: "ammar@untitledui.com",
        role: "Member",
        permissions: ["Data Export", "Data Import"],
        lastActive: "Mar 2, 2024",
        dateAdded: "Jul 4, 2022",
        status: "Invited",
    },
    {
        id: "4",
        name: "Caitlyn King",
        email: "caitlyn@untitledui.com",
        role: "Member",
        permissions: ["Data Export"],
        lastActive: "Mar 6, 2024",
        dateAdded: "Jul 4, 2022",
        status: "Active",
    },
    {
        id: "5",
        name: "Sienna Hewitt",
        email: "sienna@untitledui.com",
        role: "Admin",
        permissions: ["Data Export", "Data Import"],
        lastActive: "Mar 8, 2024",
        dateAdded: "Jul 4, 2022",
        status: "Suspended",
    },
];

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
    const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");

    const filteredUsers = useMemo(
        () =>
            USERS.filter((u) => {
                if (
                    search &&
                    !u.name.toLowerCase().includes(search.toLowerCase()) &&
                    !u.email.toLowerCase().includes(search.toLowerCase())
                ) {
                    return false;
                }
                if (roleFilter !== "All" && u.role !== roleFilter) return false;
                return !(statusFilter !== "All" && u.status !== statusFilter);

            }),
        [search, roleFilter, statusFilter]
    );

    const columns: DataTableColumn<User>[] = [
        {
            key: "select",
            header: "",
            align: "left",
            render: () => (
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                />
            ),
        },
        {
            key: "name",
            header: "User name",
            truncate: true,
            render: (user: User) => (
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
            render: (user: User) => (
                <div className="flex flex-wrap items-center gap-1.5">
                    <UserRoleBadge role={user.role} />
                    {user.permissions.map((p) => (
                        <Badge
                            key={p}
                            className="bg-slate-800/80 text-slate-200 border border-slate-600/70"
                        >
                            {p}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: "lastActive",
            header: "Last active",
            className: "data-table__cell--muted",
            render: (user: User) => (
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
            render: () => (
                <span className="text-xl text-slate-500 cursor-pointer select-none">⋯</span>
            ),
        },
    ];

    return (
        <div className="h-full w-full text-slate-100">
            <div className="users-header block-card mb-6">
                <div>
                    <h1 className="users-title">User management</h1>
                    <p className="users-subtitle">
                        Manage your team members and their access permissions here.
                    </p>
                    <div className="users-count">
                        All users{" "}
                        <span className="users-count-number">{USERS.length}</span>
                    </div>
                </div>

                <div className="users-header-actions">
                    <button className="users-btn users-btn--ghost">Filters</button>
                    <button className="users-btn users-btn--primary">+ Add user</button>
                </div>
            </div>

            <div className="block-card">
                <FilterBar
                    className="users-toolbar"
                    leftNode={
                        <div className="users-count">
                            All users{" "}
                            <span className="users-count-number">{USERS.length}</span>
                        </div>
                    }
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search user name or email..."
                    selects={[
                        {
                            id: "role",
                            value: roleFilter,
                            onChange: (v) => setRoleFilter(v as any),
                            options: [
                                { value: "All", label: "Role: All" },
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
                                { value: "All", label: "Status: All" },
                                { value: "Active", label: "Active" },
                                { value: "Invited", label: "Invited" },
                                { value: "Suspended", label: "Suspended" },
                            ],
                        },
                    ]}
                />

                <DataTable<User>
                    columns={columns}
                    data={filteredUsers}
                    getRowId={(u) => u.id}
                    emptyMessage="No users found with current filters."
                    pagination={{
                        currentPage: 1,
                        totalPages: 3,
                        pageSize: filteredUsers.length,
                        totalItems: USERS.length,
                    }}
                />
            </div>
        </div>
    );
}
