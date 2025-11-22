// components/dashboard/QuickFilters.jsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  toggleChannel,
  clearChannels,
  selectUniqueChannels,
  selectSelectedChannels,
} from "../../store/dashboardSlice";

const QuickFilters = () => {
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectUniqueChannels);
  const selectedChannels = useAppSelector(selectSelectedChannels);

  const handleToggle = (channel) => {
    dispatch(toggleChannel(channel));
  };

  const handleClear = () => {
    dispatch(clearChannels());
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Quick Filters</h3>
        {selectedChannels.length > 0 && (
          <button onClick={handleClear} style={styles.clearBtn}>
            Clear All
          </button>
        )}
      </div>

      <div style={styles.filterGrid}>
        {channels.map((channel) => {
          const isSelected = selectedChannels.includes(channel);
          return (
            <button
              key={channel}
              onClick={() => handleToggle(channel)}
              style={{
                ...styles.filterBtn,
                ...(isSelected ? styles.filterBtnActive : {}),
              }}
            >
              {channel}
            </button>
          );
        })}
      </div>

      <div style={styles.info}>
        <span style={styles.infoText}>
          {selectedChannels.length > 0
            ? `${selectedChannels.length} channel${
                selectedChannels.length > 1 ? "s" : ""
              } selected`
            : "All channels"}
        </span>
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
    marginBottom: "16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1d29",
    margin: 0,
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#4285f4",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "4px",
    transition: "all 0.15s ease",
  },
  filterGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  filterBtn: {
    padding: "8px 16px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    backgroundColor: "#f8f9fa",
    color: "#1a1d29",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  filterBtnActive: {
    backgroundColor: "#4285f4",
    color: "#ffffff",
    borderColor: "#4285f4",
  },
  info: {
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    textAlign: "center",
  },
  infoText: {
    fontSize: "12px",
    color: "#6c757d",
    fontWeight: "500",
  },
};

export default QuickFilters;
