import React, { useEffect, useState } from "react";
import { analyticsApi } from "../../lib/analytics/http";
import "../../styles/dashboard.scss";

type StatCardProps = {
    label: string;
    value: string;
};

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <span className="stat-card-icon" />
                <span className="stat-card-label">{label}</span>
            </div>
            <p className="stat-card-value">{value}</p>
        </div>
    );
}

type DashboardSummary = {
    pendingApproval: number;
    activeListings: number;
    ticketsSold: number;
    totalUsers: number;
};

type TicketsPerDayItem = {
    date: string;
    label: string;
    count: number;
};

type TicketsPerDayResponse = {
    items: TicketsPerDayItem[];
};

type RecentActivityItem = {
    id: number;
    title: string;
    author: string;
    status: string;
    createdAt: string;
};

type RecentActivityResponse = {
    items: RecentActivityItem[];
};

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [ticketsPerDay, setTicketsPerDay] = useState<TicketsPerDayItem[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const [summaryRes, perDayRes, activityRes] = await Promise.all([
                    analyticsApi.get<DashboardSummary>("/dashboard/summary"),
                    analyticsApi.get<TicketsPerDayResponse>("/dashboard/tickets-per-day", {
                        params: { days: 7 },
                    }),
                    analyticsApi.get<RecentActivityResponse>("/dashboard/recent-activity", {
                        params: { limit: 5 },
                    }),
                ]);

                setSummary(summaryRes.data);
                setTicketsPerDay(perDayRes.data.items);
                setRecentActivity(activityRes.data.items);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const stats = summary
        ? [
            { label: "Pending Approval", value: String(summary.pendingApproval) },
            { label: "Active Listings", value: String(summary.activeListings) },
            { label: "Tickets Sold", value: String(summary.ticketsSold) },
            { label: "Total Users", value: String(summary.totalUsers) },
        ]
        : [
            { label: "Pending Approval", value: "—" },
            { label: "Active Listings", value: "—" },
            { label: "Tickets Sold", value: "—" },
            { label: "Total Users", value: "—" },
        ];

    const bars = ticketsPerDay.length
        ? ticketsPerDay
        : [
            { label: "Mon", date: "", count: 0 },
            { label: "Tue", date: "", count: 0 },
            { label: "Wed", date: "", count: 0 },
            { label: "Thu", date: "", count: 0 },
            { label: "Fri", date: "", count: 0 },
            { label: "Sat", date: "", count: 0 },
            { label: "Sun", date: "", count: 0 },
        ];

    const maxCount = Math.max(1, ...bars.map((b) => b.count));

    return (
        <>
            <div className="content-main">
                <div className="stats-grid">
                    {stats.map((s) => (
                        <StatCard key={s.label} label={s.label} value={s.value} />
                    ))}
                </div>

                <section className="chart-card">
                    <div className="chart-header">
                        <h2 className="chart-title">Number of ticket per day</h2>
                        <span className="chart-subtitle">Last 7 days</span>
                    </div>

                    <div className="chart-bars">
                        {bars.map((item) => {
                            const height = (item.count / maxCount) * 80 + 5; // 5–85px
                            return (
                                <div key={item.label + item.date} className="chart-bar-wrapper">
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${height}px` }}
                                        title={`${item.label}: ${item.count}`}
                                    />
                                    <span className="chart-day-label">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            <aside className="activity-panel">
                <div className="activity-header">
                    <h2 className="activity-title">Recent Ticket Activity</h2>
                </div>

                <div className="activity-list">
                    {loading && !recentActivity.length && (
                        <p className="activity-empty">Loading recent activity...</p>
                    )}

                    {!loading && recentActivity.length === 0 && (
                        <p className="activity-empty">No recent activity.</p>
                    )}

                    {recentActivity.map((item) => (
                        <div key={item.id} className="activity-item">
                            <span className="activity-item-icon" />
                            <div>
                                <p className="activity-item-title">{item.title}</p>
                                <p className="activity-item-meta">
                                    by {item.author} · {item.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}