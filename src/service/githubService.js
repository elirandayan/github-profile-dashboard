const BASE_URL = 'https://api.github.com';
const CACHE_DURATION_MS = 10 * 60 * 1000;

export default async function fetchGitHubProfile(username) {
  const cacheKey = `devpulse_${username.toLowerCase()}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const isFresh = Date.now() - timestamp < CACHE_DURATION_MS;

      if (isFresh) {
        console.log(`%c[Cache Hit] Serving metrics for ${username}`, 'color: #007aff; font-weight: bold;');
        return data;
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  console.log(`%c[Cache Miss] Fetching live data for ${username}`, 'color: #ff9500; font-weight: bold;');
  
  const [profileRes, repoRes] = await Promise.all([
    fetch(`${BASE_URL}/users/${username}`),
    fetch(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`)
  ]);

  if (profileRes.status === 404) {
    throw new Error(`Username "${username}" not found on GitHub!`);
  }

  if (!profileRes.ok || !repoRes.ok) {
    const failedRes = !profileRes.ok ? profileRes : repoRes;
    if (failedRes.status === 403) {
      const resetTime = failedRes.headers.get('x-ratelimit-reset');
      if (resetTime) {
        const minutesLeft = Math.ceil((new Date(resetTime * 1000) - Date.now()) / 60000);
        throw new Error(`GitHub Rate limit reached. Try again in ${minutesLeft} minutes or use cache.`);
      }
    }
    throw new Error(`Failed to fetch data from GitHub.`);
  }

  const profile = await profileRes.json();
  const repos = await repoRes.json();
  const payload = { profile, repos };

  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data: payload,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.warn("Storage quota full; failed to save item to localStorage.");
  }

  return payload;
}
