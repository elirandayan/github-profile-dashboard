import React from 'react';

export default function StatsDashboard({ repos }) {
  if (!repos || repos.length === 0) {
    return <p className="no-stats">No repository data available to analyze.</p>;
  }

  let totalStars = 0;
  let totalForks = 0;
  let originalReposCount = 0;
  const languageCounts = {};

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    if (!repo.fork) originalReposCount++;
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const originalPercentage = repos.length > 0 
    ? Math.round((originalReposCount / repos.length) * 100) 
    : 0;

  return (
    <div className="stats-dashboard">
      <h3 className="dashboard-title">Developer DNA Pulse</h3>

      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-emoji">⭐</span>
          <div>
            <span className="stat-num">{totalStars}</span>
            <span className="stat-desc">Total Stars Received</span>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-emoji">🍴</span>
          <div>
            <span className="stat-num">{totalForks}</span>
            <span className="stat-desc">Total Forks Made</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h4>Top Languages</h4>
        {topLanguages.length > 0 ? (
          <div className="language-list">
            {topLanguages.map(([lang, count]) => (
              <div key={lang} className="lang-tag">
                <span className="lang-name">{lang}</span>
                <span className="lang-count">{count} projects</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="subtext">No language data detected.</p>
        )}
      </div>

      <div className="dashboard-section">
        <div className="variety-header">
          <h4>Project Style</h4>
          <span className="subtext">{originalPercentage}% Original Creations</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${originalPercentage}%` }} />
        </div>
      </div>
    </div>
  );
}
