import React from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-50 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/60">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                    <h2 className="text-sm font-semibold text-slate-100">
                        {title ?? "Modal"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-200 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="px-5 py-4">{children}</div>

                {footer && (
                    <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-5 py-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
