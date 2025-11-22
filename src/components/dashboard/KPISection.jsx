// components/dashboard/KPISection.jsx
import React from 'react';
import { useAppSelector } from '../../hooks/';
import { selectMetrics } from '../../store/dashboardSlice';

const KPISection = () => {
  const metrics = useAppSelector(selectMetrics);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const kpiCards = [
    {
      title: 'Total Spend',
      value: formatCurrency(metrics.totalSpend),
      trend: '+12.5%',
      trendPositive: true,
      icon: '💰',
      color: '#4285f4',
    },
    {
      title: 'Total Conversions',
      value: formatNumber(metrics.totalConversions),
      trend: '+8.3%',
      trendPositive: true,
      icon: '🎯',
      color: '#34a853',
    },
    {
      title: 'Total Impressions',
      value: formatNumber(metrics.totalImpressions),
      trend: '+3.2%',
      trendPositive: true,
      icon: '👁️',
      color: '#fbbc04',
    },
    {
      title: 'Average CTR',
      value: formatPercent(metrics.avgCTR),
      trend: '+5.1%',
      trendPositive: true,
      icon: '📊',
      color: '#ea4335',
    },
  ];

  return (
    <div style={styles.container}>
      {kpiCards.map((card, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{ ...styles.icon, backgroundColor: `${card.color}15` }}>
              {card.icon}
            </span>
            <span style={styles.title}>{card.title}</span>
          </div>
          <div style={styles.valueContainer}>
            <h2 style={styles.value}>{card.value}</h2>
          </div>
          <div style={styles.trendContainer}>
            <span
              style={{
                ...styles.trend,
                backgroundColor: card.trendPositive ? '#e8f5e9' : '#ffebee',
                color: card.trendPositive ? '#2e7d32' : '#c62828',
              }}
            >
              {card.trendPositive ? '↑' : '↓'} {card.trend}
            </span>
            <span style={styles.trendLabel}>vs last period</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    border: '1px solid #e0e0e0',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  icon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  title: {
    fontSize: '14px',
    color: '#6c757d',
    fontWeight: '500',
  },
  valueContainer: {
    marginBottom: '12px',
  },
  value: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1d29',
    margin: 0,
    lineHeight: '1.2',
  },
  trendContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  trend: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  trendLabel: {
    fontSize: '12px',
    color: '#a0a0a0',
  },
};

export default KPISection;