// src/components/SearchForm.jsx
import React, { useState } from 'react';

export default function SearchForm({ onSearch, loading }) {
  const [username, setUsername] = useState('github');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Enter GitHub username (e.g., gaearon)..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="search-input"
        disabled={loading}
      />
      <button type="submit" className="search-btn" disabled={loading}>
        {loading ? 'Loading...' : 'Inspect'}
      </button>
    </form>
  );
}
