from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import Ticket


def count_tickets_by_status(db: Session) -> dict:
    rows = (
        db.query(Ticket.status, func.count(Ticket.id))
        .group_by(Ticket.status)
        .all()
    )
    return {status: count for status, count in rows}


def tickets_per_day(db: Session, days: int = 7) -> List[tuple]:
    now = datetime.utcnow()
    start_date = (now - timedelta(days=days - 1)).date()

    rows = (
        db.query(func.date(Ticket.created_at), func.count(Ticket.id))
        .filter(Ticket.created_at >= start_date)
        .group_by(func.date(Ticket.created_at))
        .order_by(func.date(Ticket.created_at))
        .all()
    )
    return rows


def recent_ticket_activity(db: Session, limit: int = 5) -> List[Ticket]:
    return (
        db.query(Ticket)
        .order_by(Ticket.created_at.desc())
        .limit(limit)
        .all()
    )
