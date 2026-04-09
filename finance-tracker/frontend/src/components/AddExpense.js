import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';

const QUICK_CATEGORIES = [
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥦' },
  { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
  { id: 'lunch', name: 'Lunch', icon: '🍱' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'beverages', name: 'Beverages', icon: '☕' },
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
  { id: 'transport', name: 'Transport', icon: '🚌' },
  { id: 'fuel', name: 'Fuel', icon: '⛽' },
  { id: 'medical', name: 'Medical', icon: '💊' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'rent', name: 'Rent', icon: '🏠' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'personal', name: 'Personal Care', icon: '🧴' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'recharge', name: 'Recharge/Bills', icon: '📱' },
  { id: 'savings', name: 'Savings', icon: '💰' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export default function AddExpense() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [smartCategory, setSmartCategory] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const descTimer = useRef(null);
  const amountRef = useRef(null);

  useEffect(() => {
    loadTodayTotal();
    if (amountRef.current) amountRef.current.focus();
  }, []);

  const loadTodayTotal = async () => {
    try {
      const data = await api.getAnalytics({ period: 'today' });
      setTodayTotal(data.total);
    } catch {}
  };

  const handleDescChange = (val) => {
    setDescription(val);
    setSelectedCategory('');
    setSmartCategory(null);
    clearTimeout(descTimer.current);
    if (val.trim().length >= 2) {
      descTimer.current = setTimeout(async () => {
        try {
          const cat = await api.categorize(val);
          if (cat && cat !== 'other') {
            setSmartCategory(cat);
          }
        } catch {}
      }, 500);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId === selectedCategory ? '' : catId);
    setSmartCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const finalCat = selectedCategory || smartCategory || '';
      await api.addExpense({
        amount: parseFloat(amount),
        description,
        category: finalCat,
        date: new Date(date + 'T' + new Date().toTimeString().split(' ')[0]).toISOString(),
        note
      });
      
      const catInfo = QUICK_CATEGORIES.find(c => c.id === (finalCat || 'other'));
      toast.success(`Saved! ${catInfo?.icon || '✅'} ₹${parseFloat(amount).toLocaleString('en-IN')}`);
      
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setSmartCategory(null);
      setNote('');
      
      // Update today's total
      setTodayTotal(prev => prev + parseFloat(amount));
      
      if (amountRef.current) amountRef.current.focus();
    } catch (err) {
      toast.error('Failed to save. Is the server running?');
    }
    setLoading(false);
  };

  const activeCat = selectedCategory || smartCategory;
  const activeCatInfo = QUICK_CATEGORIES.find(c => c.id === activeCat);

  return (
    <div>
      {/* Today's running total */}
      <div className="today-summary">
        <div className="today-label">💸 Today's Total Spending</div>
        <div className="today-amount">
          <span>₹</span>{todayTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="card-title">➕ Quick Add Expense</div>

        {/* Amount - most important, first */}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Amount (₹)</label>
          <div className="amount-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              ref={amountRef}
              className="form-input"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Description - auto-categorizes */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>What did you spend on? (type name or select below)</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Apple, Petrol, Uber, Biryani..."
            value={description}
            onChange={e => handleDescChange(e.target.value)}
          />
        </div>

        {/* Smart category hint */}
        {smartCategory && !selectedCategory && (
          <div className="smart-hint">
            <span>✨</span>
            <span>Auto-detected: <strong>{activeCatInfo?.icon} {activeCatInfo?.name}</strong></span>
            <button
              type="button"
              style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}
              onClick={() => setSmartCategory(null)}
            >
              change
            </button>
          </div>
        )}

        {/* Category pills */}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Category {activeCat ? `• ${activeCatInfo?.icon} ${activeCatInfo?.name}` : '(optional – auto detected from name)'}</label>
          <div className="category-pills">
            {QUICK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${selectedCategory === cat.id ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              className="form-input date-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Note (optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="Any note..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        <button className="submit-btn" type="submit" disabled={loading || !amount}>
          {loading ? '⏳ Saving...' : `💾 Save Expense${amount ? ` — ₹${parseFloat(amount || 0).toLocaleString('en-IN')}` : ''}`}
        </button>
      </form>

      {/* Quick amount suggestions */}
      <div className="card">
        <div className="card-title">⚡ Quick Amounts</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[10, 20, 30, 50, 80, 100, 150, 200, 300, 500, 1000].map(amt => (
            <button
              key={amt}
              type="button"
              style={{
                background: amount === String(amt) ? 'var(--accent)' : 'var(--bg3)',
                border: '1px solid var(--border)',
                color: amount === String(amt) ? 'white' : 'var(--text2)',
                padding: '8px 16px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.15s'
              }}
              onClick={() => setAmount(String(amt))}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
