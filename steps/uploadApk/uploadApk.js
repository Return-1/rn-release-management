// SYNOPSIS
//     releaseSourceMaps.js [slackChannel] [apk] 

// DESCRIPTION
//      This cli utiliti posts the apk on apropriate slack channel


const { spawnSync } = require('child_process');
const chalk = require('chalk');
const { getScriptParamsAsObject, DEFAULTS } = require("../../helpers")
const config = require(process.env.PWD + '/scripts.config.js')
const apkFileName = process.argv[2];

const { cliProps: {
    outputFileName
}, userProps: {
    slackChannelIds,
    slackToken,
} } = getScriptParamsAsObject(process.argv)

console.log("in uploadApk.js")
const filePath = process.env.PWD + "/" + DEFAULTS.apkOutputPath + "/" + outputFileName
console.log("upload to slack script will find file in", filePath)

if (!apkFileName || !slackChannelIds || !slackToken) {
    console.log("Missing filename or slackChannel/slackToken. Have you specified those in the scripts.config.js file?")
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