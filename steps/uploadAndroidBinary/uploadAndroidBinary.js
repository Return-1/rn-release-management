const { spawnSync } = require('child_process');
const chalk = require('chalk');
const { getScriptParamsAsObject, DEFAULTS } = require("../../helpers")

const { cliProps: {
    outputFileName
}, userProps: {
    slackChannelIds,
    slackToken,
} } = getScriptParamsAsObject(process.argv)

console.log("In uploadApk.js")
const filePath = process.env.PWD + "/" + DEFAULTS.apkOutputPath + "/" + outputFileName
console.log("upload to slack script will find file in:\n", filePath)

if (!slackChannelIds || !slackToken) {
    console.log("Missing filename or slackChannel/slackToken. Have you specified those?")
    process.exit(1);
}

var proc = spawnSync(`bash`, [
    `${__dirname}/uploadApk.sh`,
    `${slackChannelIds.join(",")}`, //ARGUMENT 1 the slack channel
    `${slackToken}`, //ARGUMENT 2 the slack token
    `${filePath}`, //ARGUMENT 3 , the filepath
], { stdio: 'inherit' })

if (proc.status === 0) {
    console.log(chalk.green("Upload Apk succesfully"))
} else {
    console.log(chalk.red("Upload Apk got an error"))
}