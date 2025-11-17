from datetime import date, datetime, timedelta
from typing import Dict, List

from fastapi import APIRouter

from ..db import get_conn
from ..schemas.dashboard import (
    DashboardSummary,
    TicketsPerDayItem,
    TicketsPerDayResponse,
    RecentActivityItem,
    RecentActivityResponse,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary() -> DashboardSummary:
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT status, COUNT(*) FROM ticket GROUP BY status")
        rows = cur.fetchall()
        by_status: Dict[str, int] = {r[0]: int(r[1]) for r in rows}

        pending = by_status.get("open", 0)
        in_progress = by_status.get("in_progress", 0)
        resolved = by_status.get("resolved", 0)

        cur.execute('SELECT COUNT(*) FROM "user"')
        total_users_row = cur.fetchone()
        total_users = int(total_users_row[0]) if total_users_row else 0

    return DashboardSummary(
        pendingApproval=pending,
        activeListings=pending + in_progress,
        ticketsSold=resolved,
        totalUsers=total_users,
    )


@router.get("/tickets-per-day", response_model=TicketsPerDayResponse)
def get_tickets_per_day(days: int = 7) -> TicketsPerDayResponse:
    if days < 1:
        days = 1

    today = date.today()
    start_date = today - timedelta(days=days - 1)

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT DATE(created_at) AS d, COUNT(*)
            FROM ticket
            WHERE created_at >= %s
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
            """,
            (start_date,),
        )
        rows = cur.fetchall()

    date_to_count = {r[0]: int(r[1]) for r in rows}

    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    items: List[TicketsPerDayItem] = []

    for i in range(days):
        current = start_date + timedelta(days=i)
        count = date_to_count.get(current, 0)
        label = labels[current.weekday()]  # 0 = Monday
        items.append(
            TicketsPerDayItem(
                date=current.isoformat(),
                label=label,
                count=count,
            )
        )

    return TicketsPerDayResponse(items=items)


@router.get("/recent-activity", response_model=RecentActivityResponse)
def get_recent_activity(limit: int = 5) -> RecentActivityResponse:
    if limit < 1:
        limit = 1
    if limit > 50:
        limit = 50

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, title, submitted_by, status, created_at
            FROM ticket
            ORDER BY created_at DESC
            LIMIT %s
            """,
            (limit,),
        )
        rows = cur.fetchall()

    items = [
        RecentActivityItem(
            id=r[0],
            title=r[1],
            author=r[2] or "Unknown",
            status=r[3],
            createdAt=r[4],
        )
        for r in rows
    ]

    return RecentActivityResponse(items=items)
