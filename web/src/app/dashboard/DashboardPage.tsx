import React from "react";
import '../../styles/dashboard.scss'

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

export default function DashboardPage() {
  return (
      <>
        <div className="content-main">
          <div className="stats-grid">
            <StatCard label="Pending Approval" value="0" />
            <StatCard label="Active Listings" value="5" />
            <StatCard label="Tickets Sold" value="2" />
            <StatCard label="Total Users" value="4" />
          </div>

          <section className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Number of ticket per day</h2>
              <span className="chart-subtitle">Last 7 days</span>
            </div>

            <div className="chart-bars">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, idx) => {
                    const heights = [40, 24, 64, 36, 70, 60, 45];
                    return (
                        <div key={day} className="chart-bar-wrapper">
                          <div
                              className="chart-bar"
                              style={{ height: heights[idx] }}
                          />
                          <span className="chart-day-label">{day}</span>
                        </div>
                    );
                  }
              )}
            </div>
          </section>
        </div>

        <aside className="activity-panel">
          <div className="activity-header">
            <h2 className="activity-title">Recent Ticket Activity</h2>
          </div>

          <div className="activity-list">
            {[
              {
                title: "Ticket approved for vs. Team Delta",
                author: "Unknown",
              },
              {
                title: "Ticket approved for vs. Team Alpha",
                author: "Unknown",
              },
              {
                title: "Ticket sold for vs. Team Echo",
                author: "Season Holder",
              },
              {
                title: "Ticket approved for vs. Team Bravo",
                author: "John Doe",
              },
              {
                title: "Ticket approved for vs. Team Delta",
                author: "Season Holder",
              },
            ].map((item, idx) => (
                <div key={idx} className="activity-item">
                  <span className="activity-item-icon" />
                  <div>
                    <p className="activity-item-title">{item.title}</p>
                    <p className="activity-item-meta">by {item.author}</p>
                  </div>
                </div>
            ))}
          </div>
        </aside>
      </>
  );
}
