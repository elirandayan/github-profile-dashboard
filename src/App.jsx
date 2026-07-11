// src/App.jsx
import React, { useState } from 'react';
import fetchGitHubProfile from './service/githubService';

export default function App() {
  const [username, setUsername] = useState('elirandayan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if(!username.trim())
      return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchGithubProfile(username.trim());
      setData(result);
      console.log('result', result)
    } catch(err) {
      setError(err.message || 'something went wrong');
    } finally {
      setLoading(true);
    }

  }

  return (
    <div className="app-container">
      
      {/* Header */}
      <header className="">
        <h1 className="">
          DevPulse Inspector
        </h1>
        <p className="">Uncover a GitHub developer's DNA, habits, and stats.</p>
      </header>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter GitHub username (e.g., gaearon)..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="search-btn"
          disabled={loading}
        >
          { loading ? 'Loading' : 'Inspect' }
        </button>
      </form>

      <main className="placeholder-card">
        No developer profile searched yet. Enter a username above to start the diagnosis.
      </main>

    </div>
  );
}
