import React, { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import type { UserFormValues, UserStatus } from "../types/user-types";

type Mode = "create" | "edit";
type UserFormModalProps = {
    open: boolean;
    mode: Mode;
    initialValues?: UserFormValues;
    onCancel: () => void;
    onSubmit: (values: UserFormValues) => void;
};

const STATUSES: UserStatus[] = ["Active", "Invited", "Disabled"];

const DEFAULT_VALUES: UserFormValues = {
    name: "",
    email: "",
    status: "Active",
    password: "",
};

export function UserFormModal({open, mode, initialValues, onCancel, onSubmit,}: UserFormModalProps) {
    const [form, setForm] = useState<UserFormValues>(DEFAULT_VALUES);

    useEffect(() => {
        if (!open) return;

        setForm({
            ...DEFAULT_VALUES,
            ...(initialValues ?? {}),
            password: "",
        });
    }, [open, initialValues]);

    const handleChange =
        (key: keyof UserFormValues) =>
            (value: string | UserStatus) => {
                setForm((prev) => ({
                    ...prev,
                    [key]: value,
                }));
            };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = form.name.trim();
        const email = form.email.trim();
        if (!name || !email) {
            return;
        }
        const cleaned: UserFormValues = {...form, name, email};

        if (mode === "create") {
            const password = (form.password ?? "").trim();
            if (!password) {
                return;
            }
            cleaned.password = password;
        } else {
            delete cleaned.password;
        }

        onSubmit(cleaned);
    };

    const title = mode === "create" ? "Invite user" : "Edit user";
    const primaryLabel = mode === "create" ? "Invite" : "Save changes";

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title={title}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="user-form"
                        className="rounded-xl bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
                    >
                        {primaryLabel}
                    </button>
                </>
            }
        >
            <form
                id="user-form"
                onSubmit={handleSubmit}
                className="space-y-3 text-sm"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Full name
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => handleChange("name")(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                            placeholder="john@company.com"
                            value={form.email}
                            onChange={(e) => handleChange("email")(e.target.value)}
                        />
                    </div>
                </div>

                {mode === "create" && (
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                            placeholder="Choose a secure password"
                            value={form.password ?? ""}
                            onChange={(e) => handleChange("password")(e.target.value)}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Status
                        </label>
                        <select
                            className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                            value={form.status}
                            onChange={(e) =>
                                handleChange("status")(e.target.value as UserStatus)
                            }
                        >
                            {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
