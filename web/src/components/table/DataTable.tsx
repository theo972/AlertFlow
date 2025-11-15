import React from "react";
import type {DataTableProps} from "../../types/data-table.ts";
import "../../styles/data-table.scss";

export function DataTable<T extends Record<string, any>>({columns, data, getRowId, emptyMessage = "No data.", pagination}: DataTableProps<T>) {
    const resolveId = (row: T, index: number) =>
        getRowId ? getRowId(row, index) : (row as any).id ?? index;

    const alignClass = (align?: "left" | "right" | "center") => {
        if (align === "right") return "data-table__cell--right";
        if (align === "center") return "data-table__cell--center";
        return "";
    };

    return (
        <div className="data-table__card">
            <table className="data-table__table">
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={String(col.key)}
                            className={alignClass(col.align)}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {data.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="data-table__empty">
                            {emptyMessage}
                        </td>
                    </tr>
                )}

                {data.map((row, rowIndex) => (
                    <tr key={resolveId(row, rowIndex)}>
                        {columns.map((col) => {
                            const content = col.render
                                ? col.render(row, rowIndex)
                                : (row[col.key as keyof T] as React.ReactNode);

                            const baseClass = [
                                col.className,
                                alignClass(col.align),
                                col.truncate ? "data-table__cell--truncate" : "",
                            ]
                                .filter(Boolean)
                                .join(" ");

                            return (
                                <td key={String(col.key)} className={baseClass}>
                                    {content}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            {pagination && (
                <div className="data-table__footer">
          <span className="data-table__footer-count">
            Showing{" "}
              <span>
              {Math.min(pagination.pageSize, pagination.totalItems)}
            </span>{" "}
              of <span>{pagination.totalItems}</span> items
          </span>

                    <div className="data-table__pagination">
                        <button
                            className="data-table__page-btn"
                            disabled={pagination.currentPage === 1}
                            onClick={() =>
                                !(pagination) || pagination.onPageChange &&
                                pagination.onPageChange(
                                    Math.max(1, pagination.currentPage - 1)
                                )
                            }
                        >
                            ‹
                        </button>

                        {Array.from({ length: pagination.totalPages }).map((_, i) => {
                            const page = i + 1;
                            const isActive = page === pagination.currentPage;
                            return (
                                <button
                                    key={page}
                                    className={
                                        "data-table__page-btn" +
                                        (isActive ? " data-table__page-btn--active" : "")
                                    }
                                    onClick={() =>
                                        !(pagination) || pagination.onPageChange &&
                                        pagination.onPageChange(page)
                                    }
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            className="data-table__page-btn"
                            disabled={
                                pagination.currentPage === pagination.totalPages
                            }
                            onClick={() =>
                                !(pagination) || pagination.onPageChange &&
                                pagination.onPageChange(
                                    Math.min(
                                        pagination.totalPages,
                                        pagination.currentPage + 1
                                    )
                                )
                            }
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
