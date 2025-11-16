import React, { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import type { Priority, Status, TicketFormValues } from "../types/ticket-types";

type Mode = "create" | "edit";

type TicketFormModalProps = {
    open: boolean;
    mode: Mode;
    initialValues?: TicketFormValues;
    onCancel: () => void;
    onSubmit: (values: TicketFormValues) => void;
};

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];
const STATUSES: Status[] = [
    "To Do",
    "In Progress",
    "For Testing",
    "For Release",
    "Done",
    "Returned",
];

const DEFAULT_VALUES: TicketFormValues = {
    title: "",
    platform: "",
    category: "Bug",
    priority: "Medium",
    team: "Frontend",
    assignee: "",
    submittedBy: "",
    status: "To Do",
    description: "",
};

type TabKey = "main" | "details";

export function TicketFormModal({open, mode, initialValues, onCancel, onSubmit,}: TicketFormModalProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("main");
    const [form, setForm] = useState<TicketFormValues>(DEFAULT_VALUES);

    useEffect(() => {
        if (!open) return;

        setForm({
            ...DEFAULT_VALUES,
            ...(initialValues ?? {}),
        });
        setActiveTab("main");
    }, [open, initialValues]);

    const handleChange =
        (key: keyof TicketFormValues) =>
            (value: string | Priority | Status | undefined) => {
                setForm((prev) => ({
                    ...prev,
                    [key]: value,
                }));
            };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const title = form.title.trim();
        const platform = form.platform.trim();
        const cleaned: TicketFormValues = {
            ...form,
            title,
            platform,
            team: form.team.trim() || "Frontend",
            assignee: form.assignee?.trim() || "Unassigned",
            submittedBy: form.submittedBy?.trim() || "Unknown",
            description: form.description?.trim() || undefined,
        };

        onSubmit(cleaned);
    };

    const title = mode === "create" ? "Create Ticket" : "Edit Ticket";
    const primaryLabel = mode === "create" ? "Create" : "Save changes";

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
                        form="ticket-form"
                        className="rounded-xl bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
                    >
                        {primaryLabel}
                    </button>
                </>
            }
        >
            {/* Onglets */}
            <div className="mb-4 flex gap-1 rounded-full bg-slate-900/80 p-1 text-xs">
                <button
                    type="button"
                    onClick={() => setActiveTab("main")}
                    className={
                        "flex-1 rounded-full px-3 py-1 text-center transition " +
                        (activeTab === "main"
                            ? "bg-slate-100 text-slate-900 font-semibold"
                            : "text-slate-400 hover:text-slate-100")
                    }
                >
                    Main
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={
                        "flex-1 rounded-full px-3 py-1 text-center transition " +
                        (activeTab === "details"
                            ? "bg-slate-100 text-slate-900 font-semibold"
                            : "text-slate-400 hover:text-slate-100")
                    }
                >
                    Details
                </button>
            </div>

            <form
                id="ticket-form"
                onSubmit={handleSubmit}
                className="space-y-3 text-sm"
            >
                {activeTab === "main" && (
                    <>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-300">
                                Title
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                placeholder="Ex: User cannot receive notifications"
                                value={form.title}
                                onChange={(e) => handleChange("title")(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Platform
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    placeholder="Indy, MCC, ILG..."
                                    value={form.platform}
                                    onChange={(e) => handleChange("platform")(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Category
                                </label>
                                <select
                                    className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    value={form.category}
                                    onChange={(e) => handleChange("category")(e.target.value)}
                                >
                                    <option value="Bug">Bug</option>
                                    <option value="Suggestion">Suggestion</option>
                                    <option value="Improvement">Improvement</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Priority
                                </label>
                                <select
                                    className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    value={form.priority}
                                    onChange={(e) =>
                                        handleChange("priority")(e.target.value as Priority)
                                    }
                                >
                                    {PRIORITIES.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Status
                                </label>
                                <select
                                    className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    value={form.status}
                                    onChange={(e) =>
                                        handleChange("status")(e.target.value as Status)
                                    }
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Team
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    placeholder="Frontend, Backend..."
                                    value={form.team}
                                    onChange={(e) => handleChange("team")(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Assignee
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    placeholder="John Doe"
                                    value={form.assignee}
                                    onChange={(e) => handleChange("assignee")(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                    Submitted by
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                    placeholder="Jane Doe"
                                    value={form.submittedBy}
                                    onChange={(e) =>
                                        handleChange("submittedBy")(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "details" && (
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Description
                        </label>
                        <textarea
                            className="min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                            placeholder="Describe the issue, steps to reproduce, expected behavior..."
                            value={form.description ?? ""}
                            onChange={(e) =>
                                handleChange("description")(e.target.value)
                            }
                        />
                    </div>
                )}
            </form>
        </Modal>
    );
}
