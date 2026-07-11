// src/App.jsx
import React, { useState, useEffect } from 'react';
import fetchGitHubProfile from './service/githubService.js';
import SearchForm from './components/SearchForm';
import ProfileCard from './components/ProfileCard';
import StatsDashboard from './components/StatsDashboard';
import SearchHistory from './components/SearchHistory';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('devpulse_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('devpulse_search_history', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchGitHubProfile(username); 
      setData(result);

      setHistory((prevHistory) => {
        const cleanedUsername = username.toLowerCase();
        const filtered = prevHistory.filter((u) => u !== cleanedUsername);
        return [cleanedUsername, ...filtered].slice(0, 5);
      });

    } catch (err) {
      setError('ERROR: ' + (err.message || 'something went wrong'));
    } finally {
      setLoading(false); 
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>DevPulse Inspector</h1>
        <p>Uncover a GitHub developer's DNA, habits, and stats.</p>
      </header>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {/* Insert History Component right under the Form */}
      <SearchHistory 
        history={history} 
        onPillClick={handleSearch} 
        onClear={clearHistory} 
      />

      <main className="placeholder-card">
        {error && <div className="error-msg">{error}</div>}
        {loading && <div className="loading-msg">Loading data...</div>}
        
        {data && !loading && (
          <div className="inspector-results">
            <ProfileCard profile={data.profile} />
            <StatsDashboard repos={data.repos} />
          </div>
        )}
        
        {!data && !error && !loading && (
          <p>No profile searched yet!</p>
        )}
      </main>
    </div>
  );
}
