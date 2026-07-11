// src/App.jsx
import React, { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('elirandayan');

  const handleSearch = (e) => {
    e.preventDefault();
    if(!username.trim())
      return;
    alert(`searching for user ${username.trim()} (placeholder logic)`)
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
        />
        <button
          type="submit"
          className="search-btn"
        >
          Inspect
        </button>
      </form>

      <main className="placeholder-card">
        No developer profile searched yet. Enter a username above to start the diagnosis.
      </main>

    </div>
  );
}
