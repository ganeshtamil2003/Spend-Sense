import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'custom', label: 'Custom' },
];

export default function Dashboard() {
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [period]);

  const loadData = async () => {
    if (period === 'custom' && (!startDate || !endDate)) return;
    setLoading(true);
    try {
      const params = period === 'custom' ? { startDate, endDate } : { period };
      const result = await api.getAnalytics(params);
      setData(result);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

  const handleCustomSearch = () => loadData();

  const formatAmount = (n) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const chartData = data?.dailyTrend?.filter(d => d.amount > 0).slice(-14).map(d => ({
    date: format(parseISO(d.date), 'dd MMM'),
    amount: d.amount
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>
            {formatAmount(payload[0].value)}
          </div>
        </div>
      );
    }
    return null;
  };

  const periodLabel = PERIODS.find(p => p.key === period)?.label || '';

  return (
    <div>
      {/* Period Tabs */}
      <div className="period-tabs">
        {PERIODS.map(p => (
          <button key={p.key} className={`period-tab ${period === p.key ? 'active' : ''}`} onClick={() => setPeriod(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <div className="card" style={{ marginBottom: 16, padding: '16px 20px' }}>
          <div className="date-range-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-group label" style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>From</label>
              <input className="date-input form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>To</label>
              <input className="date-input form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <button className="submit-btn" style={{ width: 'auto', padding: '12px 24px', marginTop: 20 }} onClick={handleCustomSearch}>
              Search
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" /><p>Loading analytics...</p></div>
      ) : !data || data.count === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No expenses found</div>
          <div className="empty-sub">Add some expenses to see your dashboard</div>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value green">{formatAmount(data.total)}</div>
              <div className="stat-sub">{periodLabel}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Transactions</div>
              <div className="stat-value">{data.count}</div>
              <div className="stat-sub">{periodLabel}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Avg / Transaction</div>
              <div className="stat-value">{formatAmount(data.count > 0 ? data.total / data.count : 0)}</div>
              <div className="stat-sub">{periodLabel}</div>
            </div>
          </div>

          {/* Spending Trend Chart */}
          {chartData.length > 1 && (
            <div className="card">
              <div className="card-title">📈 Spending Trend (Last 14 days)</div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8892b0' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#8892b0' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#6c63ff" strokeWidth={2.5} fill="url(#colorAmt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {data.categoryBreakdown?.length > 0 && (
            <div className="card">
              <div className="card-title">🗂️ Category Breakdown</div>
              <div className="cat-list">
                {data.categoryBreakdown.map(cat => (
                  <div className="cat-row" key={cat.id}>
                    <div className="cat-icon-wrap" style={{ background: cat.color + '25' }}>
                      {cat.icon}
                    </div>
                    <div className="cat-info">
                      <div className="cat-name">{cat.name}</div>
                      <div className="cat-bar-wrap">
                        <div className="cat-bar" style={{ width: `${cat.percentage}%`, background: cat.color }} />
                      </div>
                    </div>
                    <div>
                      <div className="cat-amount">{formatAmount(cat.amount)}</div>
                      <div className="cat-pct">{cat.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pie Chart */}
          {data.categoryBreakdown?.length > 0 && (
            <div className="card">
              <div className="card-title">🥧 Spending Distribution</div>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="name"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      labelLine={false}
                    >
                      {data.categoryBreakdown.slice(0, 8).map((cat, i) => (
                        <Cell key={cat.id} fill={cat.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatAmount(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top Expenses */}
          {data.topExpenses?.length > 0 && (
            <div className="card">
              <div className="card-title">🔝 Top Expenses</div>
              {data.topExpenses.map((exp, i) => {
                const isToday = new Date(exp.date).toDateString() === new Date().toDateString();
                return (
                  <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < data.topExpenses.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', width: 20, textAlign: 'center' }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{exp.description || exp.category}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                        {isToday ? 'Today' : format(new Date(exp.date), 'dd MMM yyyy')} · {exp.category}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--red)' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
