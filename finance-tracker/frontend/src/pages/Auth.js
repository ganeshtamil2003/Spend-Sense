import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const rules = [
      'Snapchat', 'FBAV', 'FBAN', 'Instagram', 'Twitter', 'LinkedInApp', 
      'WebView', 'Android.*(wv|\\.0\\.0\\.0)'
    ];
    const isApp = rules.some(rule => new RegExp(rule, 'ig').test(userAgent));
    const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    if (isApp) {
      if (!isApple) {
        // Attempt Android breakout automatically via Intent URI
        const currentUrl = window.location.href.replace(/^https?:\/\//, '');
        window.location.href = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end;`;
      }
    }
    
    setIsInAppBrowser(isApp);
    setIsIOS(isApple);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.error_description || error.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Registration successful! Please log in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully!');
      }
    } catch (error) {
      toast.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '10px' }}>
            <span className="brand-icon">💸</span>
            <h1>SpendSense</h1>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            {isSignUp ? 'Create an account to start tracking.' : 'Login to your account.'}
          </p>
        </div>

        {isInAppBrowser && (
          <div style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'left', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
            <strong>⚠️ Access blocked for Google Sign in</strong><br/>
            {isIOS ? 
              'Snapchat/Instagram prevents Google login. Please click the 3 dots (•••) at the top right and select "Open in System Browser" or "Open in Safari".' 
              : 
              'Redirecting you to Google Chrome... If it does not redirect, click the 3 dots (•••) top right and select "Open in Browser".'
            }
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isInAppBrowser && isIOS}
          style={{ width: '100%', marginBottom: '16px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'white', color: 'black', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: isInAppBrowser && isIOS ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', transition: 'transform 0.2s', opacity: isInAppBrowser && isIOS ? 0.6 : 1 }}
          onMouseOver={(e) => { if (!(isInAppBrowser && isIOS)) e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 18 }} />
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text3)' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
          <span style={{ padding: '0 10px', fontSize: '12px', fontWeight: 600 }}>OR EMAIL</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
        </div>

        <form onSubmit={handleAuth}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-group label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="Your email address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-group label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="submit-btn" disabled={loading} type="submit">
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', margin: 0 }} /> : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            className="nav-btn"
            style={{ border: 'none', background: 'none', margin: '0 auto' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

