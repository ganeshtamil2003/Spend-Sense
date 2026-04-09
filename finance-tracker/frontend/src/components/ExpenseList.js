import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { format, isToday, isYesterday } from 'date-fns';
import { api } from '../api';

const CATEGORIES = [
  { id: 'fruits', name: 'Fruits', icon: '🍎', color: '#4CAF50' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥦', color: '#8BC34A' },
  { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: '#FF9800' },
  { id: 'lunch', name: 'Lunch', icon: '🍱', color: '#FF5722' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️', color: '#E91E63' },
  { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#9C27B0' },
  { id: 'beverages', name: 'Beverages', icon: '☕', color: '#795548' },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#009688' },
  { id: 'transport', name: 'Transport', icon: '🚌', color: '#2196F3' },
  { id: 'fuel', name: 'Fuel', icon: '⛽', color: '#607D8B' },
  { id: 'medical', name: 'Medical', icon: '💊', color: '#F44336' },
  { id: 'clothing', name: 'Clothing', icon: '👕', color: '#3F51B5' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF4081' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#FFC107' },
  { id: 'rent', name: 'Rent', icon: '🏠', color: '#673AB7' },
  { id: 'education', name: 'Education', icon: '📚', color: '#00BCD4' },
  { id: 'personal', name: 'Personal Care', icon: '🧴', color: '#CDDC39' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#FF6F00' },
  { id: 'recharge', name: 'Recharge/Bills', icon: '📱', color: '#00ACC1' },
  { id: 'savings', name: 'Savings', icon: '💰', color: '#43A047' },
  { id: 'other', name: 'Other', icon: '📦', color: '#9E9E9E' },
];

const getCat = (id) => CATEGORIES.find(c => c.id === id) || { name: id, icon: '📦', color: '#9E9E9E' };

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, dd MMM yyyy');
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [filterCat, setFilterCat] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line
  }, [period, filterCat]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (period === 'custom') {
        if (!startDate || !endDate) { setLoading(false); return; }
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        params.period = period;
      }
      if (filterCat) params.category = filterCat;
      const data = await api.getExpenses(params);
      setExpenses(data);
      setTotal(data.reduce((s, e) => s + e.amount, 0));
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setDeletingId(id);
    try {
      await api.deleteExpense(id);
      setExpenses(prev => {
        const updated = prev.filter(e => e.id !== id);
        setTotal(updated.reduce((s, e) => s + e.amount, 0));
        return updated;
      });
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeletingId(null);
  };

  const filtered = searchText
    ? expenses.filter(e =>
        e.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        e.note?.toLowerCase().includes(searchText.toLowerCase())
      )
    : expenses;

  // Group by date
  const grouped = {};
  filtered.forEach(exp => {
    const key = exp.date.split('T')[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(exp);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const PERIODS = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'custom', label: 'Custom' },
  ];

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

      {/* Custom Date Range */}
      {period === 'custom' && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <input className="form-input date-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ flex: 1 }} />
          <input className="form-input date-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ flex: 1 }} />
          <button className="submit-btn" style={{ width: 'auto', padding: '12px 20px' }} onClick={loadExpenses}>Go</button>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="form-input"
          type="text"
          placeholder="🔍 Search expenses..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1, minWidth: 150, fontSize: 13 }}
        />
        <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Summary bar */}
      {!loading && filtered.length > 0 && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>
            📋 <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> transactions
          </span>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--green)', fontSize: 16 }}>
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </span>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" /><p>Loading...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No expenses found</div>
          <div className="empty-sub">Try a different filter or add some expenses</div>
        </div>
      ) : (
        sortedDates.map(date => {
          const dayExps = grouped[date];
          const dayTotal = dayExps.reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date} className="date-group">
              <div className="date-group-header">
                {formatDateLabel(date)}
                <span style={{ color: 'var(--red)', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                  ₹{dayTotal.toLocaleString('en-IN')}
                </span>
              </div>
              {dayExps.map(exp => {
                const cat = getCat(exp.category);
                return (
                  <div key={exp.id} className="expense-item">
                    <div className="exp-icon" style={{ background: cat.color + '25' }}>
                      {cat.icon}
                    </div>
                    <div className="exp-info">
                      <div className="exp-desc">{exp.description || cat.name}</div>
                      <div className="exp-meta">
                        <span className="exp-cat-tag">{cat.icon} {cat.name}</span>
                        <span>{format(new Date(exp.date), 'hh:mm a')}</span>
                        {exp.note && <span>· {exp.note}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="exp-amount">-₹{exp.amount.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      className="exp-delete"
                      onClick={() => handleDelete(exp.id)}
                      disabled={deletingId === exp.id}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
