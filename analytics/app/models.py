from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON
from .db import Base


class Ticket(Base):
    __tablename__ = "ticket"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    submitted_by = Column(String(150), nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(180), nullable=False, unique=True)
    name = Column(String(150), nullable=False)
    permissions = Column(JSON, nullable=False)
    roles = Column(JSON, nullable=False)
    last_active = Column(DateTime, nullable=True)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
