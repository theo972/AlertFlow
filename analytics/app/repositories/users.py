from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import User


def count_users(db: Session) -> int:
    return db.query(func.count(User.id)).scalar() or 0
