// components/dashboard/TopPerformers.jsx
import React from "react";
import { useAppSelector } from "../../hooks";
import { selectTopPerformers } from "../../store/dashboardSlice";

const TopPerformers = () => {
  const topPerformers = useAppSelector(selectTopPerformers);

  const getPerformanceColor = (ctr) => {
    if (ctr >= 5) return { bg: "#e8f5e9", text: "#2e7d32" };
    if (ctr >= 3) return { bg: "#fff3e0", text: "#f57c00" };
    return { bg: "#ffebee", text: "#c62828" };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Top Performers</h3>
        <span style={styles.badge}>By CTR</span>
      </div>

      <div style={styles.list}>
        {topPerformers.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No data available</p>
          </div>
        ) : (
          topPerformers.map((performer, index) => {
            const colors = getPerformanceColor(performer.ctr);
            return (
              <div key={performer.channel} style={styles.item}>
                <div style={styles.itemHeader}>
                  <div style={styles.itemLeft}>
                    <span style={styles.rank}>#{index + 1}</span>
                    <span style={styles.channel}>{performer.channel}</span>
                  </div>
                  <span
                    style={{
                      ...styles.ctrBadge,
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {performer.ctr.toFixed(2)}%
                  </span>
                </div>
                <div style={styles.itemStats}>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Spend:</span>
                    <span style={styles.statValue}>
                      {formatCurrency(performer.spend)}
                    </span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Conv:</span>
                    <span style={styles.statValue}>
                      {performer.conversions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1d29",
    margin: 0,
  },
  badge: {
    padding: "4px 8px",
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  item: {
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
    transition: "all 0.15s ease",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  rank: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#4285f4",
  },
  channel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1d29",
  },
  ctrBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "700",
  },
  itemStats: {
    display: "flex",
    gap: "16px",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  statLabel: {
    fontSize: "11px",
    color: "#6c757d",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "12px",
    color: "#1a1d29",
    fontWeight: "600",
  },
  empty: {
    padding: "32px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: "14px",
    color: "#a0a0a0",
    margin: 0,
  },
};

export default TopPerformers;
