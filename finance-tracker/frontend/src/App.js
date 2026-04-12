import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import AddExpense from './components/AddExpense';
import ExpenseList from './pages/ExpenseList';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';
import { supabase } from './services/supabaseClient';
import './App.css';

function PrivateRoute({ children }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" replace />;
}

function App() {
  const { session } = useAuth();
  const location = useLocation();

  return (
    <div className="app">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1e2235', color: '#e2e8f0', border: '1px solid #2d3452' }
      }} />
      
      {session && (
        <header className="app-header">
          <div className="header-inner">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="brand-icon" style={{ fontSize: '24px' }}>💸</span>
              <div>
                <h1 style={{ margin: 0, fontSize: '18px' }}>SpendSense</h1>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text2)' }}>Personal Finance Tracker</p>
              </div>
            </div>
            <nav className="nav">
              <Link to="/" className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                <span>➕</span> Add
              </Link>
              <Link to="/dashboard" className={`nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                <span>📊</span> Dashboard
              </Link>
              <Link to="/history" className={`nav-btn ${location.pathname === '/history' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                <span>📋</span> History
              </Link>
              <button className="nav-btn" onClick={() => supabase.auth.signOut()} style={{ cursor: 'pointer' }}>
                <span>🚪</span> Logout
              </button>
            </nav>
          </div>
        </header>
      )}

      <main className={session ? "main-content" : ""}>
        <Routes>
          <Route path="/login" element={!session ? <Auth /> : <Navigate to="/" replace />} />
          <Route path="/" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><ExpenseList /></PrivateRoute>} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px 20px 40px', color: 'var(--text3)', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
        Designed & Developed with ❤️ by <a href="https://linkedin.com/in/ganesh-ram-m-410308213" target="_blank" rel="noreferrer" style={{ color: 'var(--text2)', textDecoration: 'none', fontWeight: 600 }}>Ganesh Ram M</a>
      </footer>
    </div>
  );
}

export default App;
