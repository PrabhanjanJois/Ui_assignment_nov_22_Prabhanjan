// components/dashboard/PerformanceChart.jsx
import React from "react";
import { useAppSelector } from "../../hooks";
import { selectChartData } from "../../store/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PerformanceChart = () => {
  const chartData = useAppSelector(selectChartData);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Performance Insights</h3>
        <p style={styles.subtitle}>Spend vs Conversions by Channel</p>
      </div>

      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="channel"
              tick={{ fill: "#6c757d", fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#6c757d", fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#6c757d", fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "8px",
              }}
              formatter={(value, name) => {
                if (name === "Spend") return [formatCurrency(value), name];
                return [value.toLocaleString(), name];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            <Bar
              yAxisId="left"
              dataKey="spend"
              name="Spend"
              fill="#4285f4"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="conversions"
              name="Conversions"
              fill="#34a853"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
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
    marginBottom: "20px",
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
  chartContainer: {
    width: "100%",
    height: "320px",
  },
};

export default PerformanceChart;
