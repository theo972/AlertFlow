import React from "react";

export type DataTableColumn<T> = {
    key: keyof T | string;
    header: string;
    align?: "left" | "right" | "center";
    truncate?: boolean;
    className?: string;
    render?: (row: T, index: number) => React.ReactNode;
};

export type DataTablePagination = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange?: (page: number) => void;
};

export type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    data: T[];
    getRowId?: (row: T, index: number) => React.Key;
    emptyMessage?: string;
    pagination?: DataTablePagination;
};
