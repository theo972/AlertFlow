import React from "react";

type SelectFilterConfig = {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
};

type FilterBarProps = {
    leftNode?: React.ReactNode;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    selects?: SelectFilterConfig[];
    className?: string;
};

export function FilterBar({leftNode, searchValue, onSearchChange, searchPlaceholder = "Search…", selects = [], className = "",}: FilterBarProps) {
    return (
        <div
            className={"flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4 " + className}>
            {leftNode && <div>{leftNode}</div>}

            <div className="flex flex-1 flex-wrap items-center gap-3 md:justify-end">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-10 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    />
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500"></span>
                </div>

                {selects?.map((f) => (
                    <select
                        key={f.id}
                        className="h-9 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                    >
                        {f.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ))}
            </div>
        </div>
    );
}
