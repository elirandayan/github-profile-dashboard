import React from 'react';

export default function ProfileCard({ profile, onRefresh }) {
  const websiteUrl = profile.blog && !profile.blog.startsWith('http') 
    ? `https://${profile.blog}` 
    : profile.blog;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img 
          src={profile.avatar_url} 
          alt={`${profile.login}'s avatar`} 
          className="profile-avatar" 
        />
        <div className="profile-titles">
          <h2>{profile.name || profile.login}</h2>
          <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
            @{profile.login}
          </a>
        </div>
      </div>

      <p className="profile-bio text-fallback">
        {profile.bio ? profile.bio : "✨ This developer hasn't added a bio yet."}
      </p>

      <div className="profile-stats-grid">
        <div className="stat-item">
          <span className="stat-value">{profile.public_repos}</span>
          <span className="stat-label">Repositories</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.following}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <ul className="profile-meta">
        <li>
          <strong>🏢 Company:</strong> {profile.company || <span className="text-fallback">Not listed</span>}
        </li>
        <li>
          <strong>📍 Location:</strong> {profile.location || <span className="text-fallback">Remote / Unknown</span>}
        </li>
        {profile.blog && (
          <li>
            <strong>🔗 Website:</strong>{' '}
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              {profile.blog}
            </a>
          </li>
        )}
      </ul>

      <button 
        className="refresh-btn" 
        onClick={() => onRefresh(profile.login, true)}
      >
        🔄 Sync Live Data
      </button>
    </div>
  );
}
