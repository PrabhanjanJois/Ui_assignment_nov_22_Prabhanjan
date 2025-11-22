// components/dashboard/Header.jsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  resetFilters,
  selectSearchTerm,
  selectSelectedChannels,
} from "../../store/dashboardSlice";
import "../../styles/header.css";

const Header = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedChannels = useAppSelector(selectSelectedChannels);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const hasActiveFilters = searchTerm || selectedChannels.length > 0;

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-brand">
            <div className="brand-icon">📊</div>
            <div className="brand-text">
              <h1 className="brand-title">Marketing Analytics</h1>
              <p className="brand-subtitle">Performance Dashboard</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          {hasActiveFilters && (
            <button
              className="header-reset-btn"
              onClick={handleResetFilters}
              title="Clear all filters"
            >
              <span className="reset-icon">↻</span>
              <span className="reset-text">Reset Filters</span>
            </button>
          )}

          <div className="header-time">
            <div className="time-display">
              <span className="time-value">{formatTime(currentTime)}</span>
              <span className="time-separator">•</span>
              <span className="date-value">{formatDate(currentTime)}</span>
            </div>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-text">Live</span>
            </div>
          </div>

          <div className="header-actions">
            <button className="header-btn" title="Refresh data">
              <span className="btn-icon">🔄</span>
            </button>
            <button className="header-btn" title="Export data">
              <span className="btn-icon">📥</span>
            </button>
            <button className="header-btn" title="Settings">
              <span className="btn-icon">⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
