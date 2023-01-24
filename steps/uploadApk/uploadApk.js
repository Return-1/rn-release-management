// SYNOPSIS
//     releaseSourceMaps.js [slackChannel] [apk] 

// DESCRIPTION
//      This cli utiliti posts the apk on apropriate slack channel


const { spawnSync } = require('child_process');
const chalk = require('chalk');

const config = require(process.env.PWD + '/scripts.config.js')
const apkFileName = process.argv[2];

console.log("in uploadApk.js")
console.log(config.slackChannelIds)
console.log(config.slackToken)
const filePath = process.env.PWD + "/IGNORABLES/archiveAPKs/" + apkFileName
// const filePath = __dirname + "/text.txt"
console.log("will find file in", filePath)

if (!apkFileName || !config.slackChannelIds || !config.slackToken) {
    console.log("Missing filename or slackChannel/slackToken. Have you specified those in the scripts.config.js file?")
    process.exit(1);
}

var proc = spawnSync(`bash`, [
    `${__dirname}/uploadApk.sh`,
    `${config.slackChannelIds.join(",")}`, //ARGUMENT 1 the slack channel
    `${config.slackToken}`, //ARGUMENT 2 the slack token
    `${filePath}`, //ARGUMENT 3 , the filepath
], { stdio: 'inherit' })

if (proc.status === 0) {
    console.log(chalk.green("Upload Apk succesfully"))
} else {
    console.log(chalk.red("Upload Apk got an error"))
}