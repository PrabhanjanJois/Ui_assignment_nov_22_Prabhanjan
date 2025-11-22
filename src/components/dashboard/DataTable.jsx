// components/table/DataTable.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setSearchTerm,
  setSortConfig,
  setCurrentPage,
  selectPaginatedData,
  selectSearchTerm,
  selectSortConfig,
  selectCurrentPage,
  selectTotalPages,
  selectTotalRecords,
} from "../../store/dashboardSlice";

const DataTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectPaginatedData);
  const searchTerm = useAppSelector(selectSearchTerm);
  const sortConfig = useAppSelector(selectSortConfig);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const totalRecords = useAppSelector(selectTotalRecords);

  const [searchInput, setSearchInput] = useState(searchTerm);

  const handleSort = useCallback(
    (key) => {
      dispatch(setSortConfig(key));
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);
      // Debounce search
      const timer = setTimeout(() => {
        dispatch(setSearchTerm(value));
      }, 300);
      return () => clearTimeout(timer);
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value) => {
    return value.toLocaleString();
  };

  const calculateCTR = (conversions, impressions) => {
    if (impressions === 0) return "0.00%";
    return `${((conversions / impressions) * 100).toFixed(2)}%`;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const columns = [
    { key: "channel", label: "Channel", sortable: true },
    { key: "region", label: "Region", sortable: true },
    { key: "spend", label: "Spend", sortable: true },
    { key: "impressions", label: "Impressions", sortable: true },
    { key: "clicks", label: "Clicks", sortable: true },
    { key: "conversions", label: "Conversions", sortable: true },
    { key: "ctr", label: "CTR", sortable: false },
  ];

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Campaign Data</h3>
          <p style={styles.subtitle}>
            Showing {data.length} of {totalRecords} records
          </p>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search channels..."
            value={searchInput}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...styles.th,
                    cursor: col.sortable ? "pointer" : "default",
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div style={styles.thContent}>
                    {col.label}
                    {col.sortable && (
                      <span style={styles.sortIcon}>
                        {getSortIcon(col.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={styles.emptyCell}>
                  <div style={styles.empty}>
                    <p style={styles.emptyText}>No data found</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.channelBadge}>{row.channel}</span>
                  </td>
                  <td style={styles.td}>{row.region}</td>
                  <td style={styles.td}>{formatCurrency(row.spend)}</td>
                  <td style={styles.td}>{formatNumber(row.impressions)}</td>
                  <td style={styles.td}>{formatNumber(row.clicks)}</td>
                  <td style={styles.td}>{formatNumber(row.conversions)}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.ctrBadge,
                        backgroundColor:
                          (row.conversions / row.impressions) * 100 >= 0.5
                            ? "#e8f5e9"
                            : "#ffebee",
                        color:
                          (row.conversions / row.impressions) * 100 >= 0.5
                            ? "#2e7d32"
                            : "#c62828",
                      }}
                    >
                      {calculateCTR(row.conversions, row.impressions)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.pageBtn,
            ...(currentPage === 1 ? styles.pageBtnDisabled : {}),
          }}
        >
          ← Previous
        </button>

        <div style={styles.pageNumbers}>
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              style={{
                ...styles.pageNumber,
                ...(page === currentPage ? styles.pageNumberActive : {}),
                ...(page === "..." ? styles.pageNumberDots : {}),
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...styles.pageBtn,
            ...(currentPage === totalPages ? styles.pageBtnDisabled : {}),
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  header: {
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
  },
  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1d29",
    margin: 0,
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6c757d",
    margin: 0,
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8f9fa !important",
  },
  searchInput: {
    width: "300px",
    padding: "10px 16px",
    border: "1px solid #e0e0e0",
    backgroundColor: "#f8f9fa !important",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.15s ease",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    backgroundColor: "#f8f9fa",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#1a1d29",
    borderBottom: "2px solid #e0e0e0",
    userSelect: "none",
  },
  thContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sortIcon: {
    fontSize: "12px",
    color: "#6c757d",
  },
  tr: {
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.15s ease",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#1a1d29",
  },
  channelBadge: {
    padding: "4px 12px",
    backgroundColor: "#e8f0fe",
    color: "#1967d2",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "600",
  },
  ctrBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  emptyCell: {
    padding: 0,
  },
  empty: {
    padding: "64px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: "14px",
    color: "#a0a0a0",
    margin: 0,
  },
  pagination: {
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e0e0e0",
  },
  pageBtn: {
    padding: "8px 16px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    color: "#1a1d29",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  pageNumbers: {
    display: "flex",
    gap: "4px",
  },
  pageNumber: {
    width: "36px",
    height: "36px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    color: "#1a1d29",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  pageNumberActive: {
    backgroundColor: "#4285f4",
    color: "#ffffff",
    borderColor: "#4285f4",
  },
  pageNumberDots: {
    border: "none",
    cursor: "default",
  },
};

export default DataTable;
