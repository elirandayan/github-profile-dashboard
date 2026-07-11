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

  const handleSearch = async (username, forceRefresh = false) => {
    const cleanedUsername = username.trim().toLowerCase();
    const sanitizedUsername = cleanedUsername
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '');

    if(sanitizedUsername !== cleanedUsername){
      setError('Invalid characters in username. Use only alphanumeric characters, underscores, or hyphens.');
      return;
    }

    setLoading(true);
    setError(null);
    
    if (forceRefresh) setData(null); 

    try {
      if (forceRefresh) {
        localStorage.removeItem(`devpulse_${sanitizedUsername}`);
      }
      
      const result = await fetchGitHubProfile(sanitizedUsername); 
      setData(result);

      setHistory((prevHistory) => {
        const filtered = prevHistory.filter((u) => u !== sanitizedUsername);
        return [sanitizedUsername, ...filtered].slice(0, 5);
      });
    } catch (err) {
      setError('ERROR: ' + (err.message || 'Something went wrong'));
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

      <SearchForm onSearch={(uname) => handleSearch(uname, false)} loading={loading} />

      <SearchHistory 
        history={history} 
        onPillClick={(uname) => handleSearch(uname, false)} 
        onClear={clearHistory} 
        loading={loading}
      />

      <main className="placeholder-card">
        {error && <div className="error-msg">{error}</div>}
        {loading && <div className="loading-msg">Inspecting GitHub DNA...</div>}
        
        {data && !loading && (
          <div className="inspector-results">
            <ProfileCard profile={data.profile} onRefresh={handleSearch} />
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
