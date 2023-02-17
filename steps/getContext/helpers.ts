const { execSync } = require('child_process');

function getCurrentBranchName(): string | null {
    try {
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        return currentBranch
    } catch (error) {
        console.log(error)
        return null;
    }
}

module.exports = { getCurrentBranchName }