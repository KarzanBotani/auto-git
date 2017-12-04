const simpleGit = require('simple-git/promise'),
      path = require('path'), // jämnar ut skillnaden mellan operativystem när man slår ihop paths
      basePath = '/var/www',
      repoInfo = require('./repos-and-branches.json');

// checkout a branch and make a pull for that branch
async function pull(repoPath, branch) {
  let repo,
      status,
      err;

  try {
    repo = simpleGit(repoPath);
    await repo.checkout(branch);
    status = await repo.pull('origin', branch);
  } catch (e) {
    err = e;
  }

  // only logs changes and errors
  if (status.files && status.files.length != 0) {
    console.log('pull-success: ', status);
  }

  if (err) {
    console.log('pull-error: ', error)
  }
}

// every 10 seconds, loop through our repos
// and call the pull function
setInterval(() => {
  for (let repo of repoInfo) {
    // får tillbaka ett objekt med en path och vilken branch man borde ligga på
    pull(path.join(basePath, repo.path), repo.branch)
  }
}, 10000);