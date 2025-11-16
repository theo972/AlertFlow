import React from "react";
import { Modal } from "./Modal";

type ActionDeleteContentModalProps = {
    open: boolean;
    title: string;
    label: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ActionDeleteContentModal({open, title, label, onCancel, onConfirm}: ActionDeleteContentModalProps) {
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
                        Non, annuler
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/40 hover:bg-rose-500"
                    >
                        Oui, supprimer
                    </button>
                </>
            }
        >
            <div className="space-y-2 text-sm">
                <p className="text-slate-100">{label}</p>
                <p className="text-xs text-slate-500">
                    Cette action est définitive et ne peut pas être annulée.
                </p>
            </div>
        </Modal>
    );
}
