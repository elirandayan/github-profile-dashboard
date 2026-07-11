const BASE_URL = 'https://api.github.com';

export default async function fetchGithubProfile(username){
  const [profileRes, repoRes] = await Promise.all([
    fetch(`${BASE_URL}/users/${username}`),
    fetch(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`),
  ])

  if(profileRes.status === 404)
    throw new Error(`Username ${username} not found on GitHub!`);

  if(!profileRes.ok || !repoRes.ok)
    throw new Error(`Failed to fetch either profile or repos from github`);

  const profile = await profileRes.json();
  const repos = await repoRes.json();

  console.log('profile', profile)
  console.log('repos', repos)

  return { profile, repos };
}
