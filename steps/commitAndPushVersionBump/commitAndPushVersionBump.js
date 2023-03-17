const chalk = require('chalk')
const { spawnSync } = require('child_process')

const { getScriptParamsAsObject } = require("../../helpers")

const context = getScriptParamsAsObject(process.argv)
const { cliProps: {
    application,
    version,
    buildNumber,
    currentBranchName,
}, userProps: {
    commitMessage = `version bump ${application} v.${version} buildNo.${buildNumber}`
} } = context;

const commitAndPushProcess = spawnSync(`bash`, [
    `${__dirname}/commitAndPushVersionBump.sh`,
    application,
    version,
    buildNumber,
    currentBranchName,
    commitMessage,
], { stdio: 'inherit' })

if (commitAndPushProcess.status !== 0) {
    console.log(chalk.red("ERROR: in git push on commitAndPushVersionBump.js"))
    process.exit(1)
}


