const { execSync } = require('child_process');

const getCurrentBranchName = () => {
    try {
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        return currentBranch
    } catch (error) {
        console.log(error)
        return null;
    }
}

module.exports = { getCurrentBranchName }