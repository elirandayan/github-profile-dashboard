// src/App.jsx
import React, { useState } from 'react';
import fetchGitHubProfile from './service/githubService.js';
import SearchForm from './components/SearchForm';
import ProfileCard from './components/ProfileCard';
import StatsDashboard from './components/StatsDashboard.jsx';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchGitHubProfile(username); 
      setData(result);
    } catch (err) {
      setError('ERROR: ' + (err.message || 'something went wrong'));
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>DevPulse Inspector</h1>
        <p>Uncover a GitHub developer's DNA, habits, and stats.</p>
      </header>

      {/* Extracted Form Component */}
      <SearchForm onSearch={handleSearch} loading={loading} />

      <main className="placeholder-card">
        {error && <div>{error}</div>}
        {loading && <div>Loading data...</div>}
        
        {/* Extracted Profile Card Component */}
        {data && !loading && (
          <div>
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
