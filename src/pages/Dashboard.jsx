// Dashboard.jsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  loadDashboardData,
  selectLoading,
  selectError,
} from "../store/dashboardSlice";
import "../styles/dashboard.css";
import Header from "../components/dashboard/Header";
import Loader from "../components/common/Loader";
import KPISection from "../components/dashboard/KPISection";
import QuickFilters from "../components/dashboard/QuickFilters";
import TopPerformers from "../components/dashboard/TopPerformers";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import DataTable from "../components/dashboard/DataTable";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  // Load data on mount
  useEffect(() => {
    dispatch(loadDashboardData());
  }, [dispatch]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <h2>⚠️ Failed to load dashboard</h2>
          <p>{error}</p>
          <button
            onClick={() => dispatch(loadDashboardData())}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-container">
          <section className="dashboard-section">
            <KPISection />
          </section>

          <section className="dashboard-section">
            <div className="data-table-wrapper">
              <DataTable />
            </div>
          </section>
          <section className="dashboard-section dashboard-grid">
            <div className="dashboard-chart-container">
              {/* optional inner wrapper for consistent sizing */}
              <div className="chart-inner">
                <PerformanceChart />
              </div>
            </div>

            <div className="dashboard-sidebar">
              <QuickFilters />
              <TopPerformers />
            </div>
          </section>

          {/* Data Table Section - wrapped so it can scroll internally */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
