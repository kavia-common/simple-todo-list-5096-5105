import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { supabase } from './utils/supabaseClient';

function App() {
  const [theme, setTheme] = useState('light');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSession(data?.session ?? null);
      // subscribe to auth changes
      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        setSession(sess ?? null);
      });
      return () => {
        listener.subscription.unsubscribe();
      };
    };
    const cleanup = init();
    return () => {
      mounted = false;
      // cleanup listener if promise resolved
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const signIn = async (e) => {
    e.preventDefault();
    setStatus('Signing in...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? `Error: ${error.message}` : 'Signed in');
  };

  const signUp = async (e) => {
    e.preventDefault();
    setStatus('Signing up...');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    setStatus(error ? `Error: ${error.message}` : 'Check your email for confirmation link');
  };

  const signOut = async () => {
    setStatus('Signing out...');
    const { error } = await supabase.auth.signOut();
    setStatus(error ? `Error: ${error.message}` : 'Signed out');
  };

  const loadTodos = async () => {
    setStatus('Loading todos...');
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (error) setStatus(`Error: ${error.message}`);
    else {
      setTodos(data || []);
      setStatus(`Loaded ${data?.length || 0} todos`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Current theme: <strong>{theme}</strong>
        </p>

        {!session ? (
          <form style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ padding: 8 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: 8 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={signIn} className="theme-toggle" type="button">Sign In</button>
              <button onClick={signUp} className="theme-toggle" type="button">Sign Up</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={loadTodos} className="theme-toggle" type="button">Load Todos</button>
              <button onClick={signOut} className="theme-toggle" type="button">Sign Out</button>
            </div>
            <ul style={{ textAlign: 'left', marginTop: 16 }}>
              {todos.map(t => (
                <li key={t.id}>
                  [{t.complete ? 'x' : ' '}] {t.title}
                </li>
              ))}
            </ul>
          </>
        )}

        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>{status}</p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
