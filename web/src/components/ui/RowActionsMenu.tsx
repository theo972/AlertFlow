import React, { useEffect, useRef, useState } from "react";

type RowActionsMenuProps = {
    onEdit?: () => void;
    onDelete?: () => void;
};

export function RowActionsMenu({ onEdit, onDelete }: RowActionsMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!open) return;

        const handleClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [open]);

    const handleEditClick = () => {
        setOpen(false);
        onEdit?.();
    };

    const handleDeleteClick = () => {
        setOpen(false);
        onDelete?.();
    };

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-900 hover:text-slate-100"
            >
                ⋯
            </button>

            {open && (
                <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl shadow-black/50">
                    <button
                        type="button"
                        onClick={handleEditClick}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-100 hover:bg-slate-900"
                    >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        <span>Modifier</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:bg-rose-950/60"
                    >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
                        <span>Supprimer</span>
                    </button>
                </div>
            )}
        </div>
    );
}
