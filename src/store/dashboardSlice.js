// store/dashboardSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

// Async thunk for loading data
export const loadDashboardData = createAsyncThunk(
  "dashboard/loadData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error("Failed to load data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  searchTerm: "",
  selectedChannels: [], // Array instead of Set for Redux serialization
  sortConfig: {
    key: null,
    direction: "asc",
  },
  currentPage: 1,
  pageSize: 50,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page
    },

    toggleChannel: (state, action) => {
      const channel = action.payload;
      const index = state.selectedChannels.indexOf(channel);

      if (index > -1) {
        state.selectedChannels.splice(index, 1);
      } else {
        state.selectedChannels.push(channel);
      }
      state.currentPage = 1;
    },

    clearChannels: (state) => {
      state.selectedChannels = [];
      state.currentPage = 1;
    },

    setSortConfig: (state, action) => {
      const key = action.payload;
      if (state.sortConfig.key === key) {
        state.sortConfig.direction =
          state.sortConfig.direction === "asc" ? "desc" : "asc";
      } else {
        state.sortConfig.key = key;
        state.sortConfig.direction = "asc";
      }
      state.currentPage = 1;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    resetFilters: (state) => {
      state.searchTerm = "";
      state.selectedChannels = [];
      state.sortConfig = { key: null, direction: "asc" };
      state.currentPage = 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
      });
  },
});

// Action creators
export const {
  setSearchTerm,
  toggleChannel,
  clearChannels,
  setSortConfig,
  setCurrentPage,
  resetFilters,
} = dashboardSlice.actions;

// Basic selectors
export const selectRawData = (state) => state.dashboard.data;
export const selectLoading = (state) => state.dashboard.loading;
export const selectError = (state) => state.dashboard.error;
export const selectSearchTerm = (state) => state.dashboard.searchTerm;
export const selectSelectedChannels = (state) =>
  state.dashboard.selectedChannels;
export const selectSortConfig = (state) => state.dashboard.sortConfig;
export const selectCurrentPage = (state) => state.dashboard.currentPage;
export const selectPageSize = (state) => state.dashboard.pageSize;

// Memoized selectors using createSelector
export const selectFilteredData = createSelector(
  [selectRawData, selectSearchTerm, selectSelectedChannels],
  (data, searchTerm, selectedChannels) => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.channel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesChannel =
        selectedChannels.length === 0 ||
        selectedChannels.includes(item.channel);

      return matchesSearch && matchesChannel;
    });
  }
);

export const selectSortedData = createSelector(
  [selectFilteredData, selectSortConfig],
  (filteredData, sortConfig) => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }
);

export const selectPaginatedData = createSelector(
  [selectSortedData, selectCurrentPage, selectPageSize],
  (sortedData, currentPage, pageSize) => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return sortedData.slice(startIdx, endIdx);
  }
);

export const selectTotalPages = createSelector(
  [selectSortedData, selectPageSize],
  (sortedData, pageSize) => Math.ceil(sortedData.length / pageSize)
);

export const selectTotalRecords = createSelector(
  [selectSortedData],
  (sortedData) => sortedData.length
);

// Computed metrics selector
export const selectMetrics = createSelector(
  [selectFilteredData],
  (filteredData) => {
    if (filteredData.length === 0) {
      return {
        totalSpend: 0,
        totalConversions: 0,
        totalImpressions: 0,
        avgCTR: 0,
      };
    }

    const totals = filteredData.reduce(
      (acc, item) => ({
        spend: acc.spend + item.spend,
        conversions: acc.conversions + item.conversions,
        impressions: acc.impressions + item.impressions,
      }),
      { spend: 0, conversions: 0, impressions: 0 }
    );

    return {
      totalSpend: totals.spend,
      totalConversions: totals.conversions,
      totalImpressions: totals.impressions,
      avgCTR:
        totals.impressions > 0
          ? (totals.conversions / totals.impressions) * 100
          : 0,
    };
  }
);

// Chart data selector - aggregate by channel
export const selectChartData = createSelector(
  [selectFilteredData],
  (filteredData) => {
    const channelMap = new Map();

    filteredData.forEach((item) => {
      if (!channelMap.has(item.channel)) {
        channelMap.set(item.channel, {
          channel: item.channel,
          spend: 0,
          conversions: 0,
          impressions: 0,
        });
      }

      const channel = channelMap.get(item.channel);
      channel.spend += item.spend;
      channel.conversions += item.conversions;
      channel.impressions += item.impressions;
    });

    return Array.from(channelMap.values())
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10); // Top 10 channels
  }
);

// Top performers selector
export const selectTopPerformers = createSelector(
  [selectChartData],
  (chartData) => {
    return chartData
      .map((item) => ({
        ...item,
        ctr:
          item.impressions > 0
            ? (item.conversions / item.impressions) * 100
            : 0,
      }))
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 5);
  }
);

// Unique channels selector
export const selectUniqueChannels = createSelector([selectRawData], (data) => {
  const channels = new Set(data.map((item) => item.channel));
  return Array.from(channels).sort();
});

export default dashboardSlice.reducer;
