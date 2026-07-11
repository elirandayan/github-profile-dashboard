import React from 'react';

export default function SearchHistory({ history, onPillClick, onClear }) {
  if (history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <span className="history-label">Recent Inspections:</span>
        <button className="clear-history-btn" onClick={onClear}>
          Clear All
        </button>
      </div>
      <div className="history-pills">
        {history.map((username) => (
          <button
            key={username}
            className="history-pill"
            onClick={() => onPillClick(username)}
          >
            @{username}
          </button>
        ))}
      </div>
    </div>
  );
}
