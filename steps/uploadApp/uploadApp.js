const fs = require('fs')
const { spawnSync } = require('child_process');
const chalk = require('chalk');
const { getScriptParamsAsObject, DEFAULTS } = require("../../helpers")

const { cliProps: {
    outputApkFileName,
    outputAabFileName,
}, userProps: {
    slackChannelIds,
    slackToken,
} } = getScriptParamsAsObject(process.argv)

console.log("In uploadApk.js")
const apkFilePath = process.env.PWD + "/" + DEFAULTS.apkOutputPath + "/" + outputApkFileName
const aabFilePath = process.env.PWD + "/" + DEFAULTS.aabOutputPath + "/" + outputAabFileName
let filePath = apkFilePath

if (fs.existsSync(aabFilePath)) {
    filePath = aabFilePath
}
console.log("upload to slack script will find file in:\n", filePath)

if (!slackChannelIds || !slackToken) {
    console.log("Missing filename or slackChannel/slackToken. Have you specified those?")
    process.exit(1);
}

var proc = spawnSync(`bash`, [
    `${__dirname}/uploadApp.sh`,
    `${slackChannelIds.join(",")}`, //ARGUMENT 1 the slack channel
    `${slackToken}`, //ARGUMENT 2 the slack token
    `${filePath}`, //ARGUMENT 3 , the filepath
], { stdio: 'inherit' })

if (proc.status === 0) {
    console.log(chalk.green("Upload Apk succesfully"))
} else {
    console.log(chalk.red("Upload Apk got an error"))
}