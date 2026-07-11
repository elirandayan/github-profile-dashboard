// src/App.jsx
import React, { useState } from 'react';
import fetchGithubProfile from './service/githubService.js';

export default function App() {
  const [username, setUsername] = useState('elirandayan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  console.log(fetchGithubProfile);

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
      setError('ERROR: ' + err.message || 'something went wrong');
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="app-container">
      
      {/* Header */}
      <header className="">
        <h1 className="">
          GitHub Inspector
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
        { error && ( <div>{ error }</div> )}
        { loading && ( <div>Loading..</div> )}
        { data && !loading && (
          <div className='profile-card'>
            <div className='profile-header'>
              <img
                src={data.profile.avatar_url}
                alt={`${data.profile.login}'s avatar'`}
                className='profile-avatar'
              />
              <div className='profile-titles'>
                <h2>
                  {data.profile.name || data.profile.login}
                </h2>
                <a
                  href={data.profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='profile-link'
                >
                  @{data.profile.login}
                </a>
              </div>
            </div>
          </div>
        )}
        { !data && !error && !loading && (
          <p>No profile searched yet!</p>
        )}
      </main>

    </div>
  );
}
