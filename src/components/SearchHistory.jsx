import React from 'react';

export default function SearchHistory({ history, onPillClick, onClear, loading }) {
  if (history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <span className="history-label">Recent Inspections:</span>
        <button className="clear-history-btn" onClick={onClear} disabled={loading}>
          Clear All
        </button>
      </div>
      <div className="history-pills">
        {history.map((username) => (
          <button
            key={username}
            className="history-pill"
            onClick={() => onPillClick(username)}
            disabled={loading}
            style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            @{username}
          </button>
        ))}
      </div>
    </div>
  );
}
