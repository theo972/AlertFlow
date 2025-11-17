from datetime import datetime
from typing import List
from pydantic import BaseModel


class DashboardSummary(BaseModel):
    pendingApproval: int
    activeListings: int
    ticketsSold: int
    totalUsers: int


class TicketsPerDayItem(BaseModel):
    date: str
    label: str
    count: int


class RecentActivityItem(BaseModel):
    id: int
    title: str
    author: str
    status: str
    createdAt: datetime


class TicketsPerDayResponse(BaseModel):
    items: List[TicketsPerDayItem]


class RecentActivityResponse(BaseModel):
    items: List[RecentActivityItem]
