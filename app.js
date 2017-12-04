const simpleGit = require('simple-git/promise'),
      path = require('path'), // jämnar ut skillnaden mellan operativystem när man slår ihop paths
      basePath = '/var/www',
      repoInfo = require('./repos-and-branches.json'),
      pm = require('promisemaker'),
      exec = pm(require('child_process')).exec;

// checkout a branch and make a pull for that branch
async function pull(repoPath, branch, run) {
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

  let changed = status.files && status.files.length != 0;

  // only logs changes and errors
  if (changed) {
    console.log('pull-success: ', repoPath, branch, status);
  }

  if (err) {
    console.log('pull-error: ', repoPath, branch, error)
  }

  if (changed && run) {
    for (let cmd of run) {
      let err, result = await exec(
        cmd,
        {cwd: repoPath}
      ).catch((e) => err = e);

      if (result) {
        console.log('Running: ', cmd, '\n', result);
      }

      if (err) {
        console.log('Error running: ', cmd, '\n', err);
      }
    }
  }

}

// every 10 seconds, loop through our repos
// and call the pull function
setInterval(()=>{
  for(let repo of repoInfo){
    pull(
      path.join(basePath, repo.path),
      repo.branch,
      repo.run
    );
  }
}, 10000);