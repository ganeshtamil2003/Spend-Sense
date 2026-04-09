import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="app">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1e2235', color: '#e2e8f0', border: '1px solid #2d3452' }
      }} />
      
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">💸</span>
            <div>
              <h1>SpendSense</h1>
              <p>Personal Finance Tracker</p>
            </div>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
              <span>➕</span> Add
            </button>
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span>📊</span> Dashboard
            </button>
            <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <span>📋</span> History
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'add' && <AddExpense />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'history' && <ExpenseList />}
      </main>
    </div>
  );
}

export default App;
