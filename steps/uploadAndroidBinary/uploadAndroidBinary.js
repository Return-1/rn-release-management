const { spawnSync } = require('child_process');
const chalk = require('chalk');
const { getScriptParamsAsObject, DEFAULTS } = require("../../helpers")

const context = getScriptParamsAsObject(process.argv)
const { cliProps: {
    finalOutputFilePath
}, userProps: {
    slackChannelIds,
    slackToken,
} } = context

console.log("In uploadAndroidBinary.js")
console.log("upload to slack script will find file in:\n", finalOutputFilePath)

if (!slackChannelIds || !slackToken) {
    console.log("Missing filename or slackChannel/slackToken. Have you specified those?")
    process.exit(1);
}

var proc = spawnSync(`bash`, [
    `${__dirname}/uploadAndroidBinary.sh`,
    `${slackChannelIds.join(",")}`, //ARGUMENT 1 the slack channel
    `${slackToken}`, //ARGUMENT 2 the slack token
    `${finalOutputFilePath}`, //ARGUMENT 3 , the filepath
], { stdio: 'inherit' })

if (proc.status === 0) {
    console.log(chalk.green("Upload Apk succesfully"))
} else {
    console.log(chalk.red("Upload Apk got an error"))
}