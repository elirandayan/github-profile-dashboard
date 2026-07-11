// src/service/githubService.js
const BASE_URL = 'https://api.github.com';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

export default async function fetchGitHubProfile(username) {
  const cacheKey = `devpulse_${username.toLowerCase()}`;
  const cachedData = localStorage.getItem(cacheKey);

  // 1. Check if valid data is sitting in local cache
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const isFresh = Date.now() - timestamp < CACHE_DURATION_MS;

      if (isFresh) {
        console.log(`%c[Cache Hit] Serving metrics for ${username}`, 'color: #007aff; font-weight: bold;');
        return data;
      }
    } catch (e) {
      // If JSON parsing fails for any reason, clear it out silently and fall through to fetch
      localStorage.removeItem(cacheKey);
    }
  }

  // 2. Cache miss or expired entry -> Proceed with API request
  console.log(`%c[Cache Miss] Fetching live data for ${username}`, 'color: #ff9500; font-weight: bold;');

  const [profileRes, repoRes] = await Promise.all([
    fetch(`${BASE_URL}/users/${username}`),
    fetch(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`)
  ]);

  if (profileRes.status === 404) {
    throw new Error(`Username "${username}" not found on GitHub!`);
  }

  if (!profileRes.ok || !repoRes.ok) {
    throw new Error(`Failed to fetch profile or repositories from GitHub.`);
  }

  const profile = await profileRes.json();
  const repos = await repoRes.json();
  const payload = { profile, repos };

  // 3. Store the successful payload with a fresh timestamp
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data: payload,
      timestamp: Date.now()
    }));
  } catch (err) {
    // Graceful handling if localStorage is full (Quotas exceeded)
    console.warn("Storage quota full; failed to save item to localStorage.");
  }

  return payload;
}
