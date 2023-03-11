const { spawnSync } = require('child_process');
const chalk = require('chalk');
const { getScriptParamsAsObject, DEFAULTS } = require("../../helpers")

let { cliProps: {
    finalOutputFilePath
}, userProps: {
    slackChannelIds: slackChannelIdsFromUserProps,
    slackToken: slackTokenFromUserProps,
}, envProps: {
    RNRM_uploadAndroidBinary_slackChannelIds,
    RNRM_uploadAndroidBinary_slackToken,
} } = getScriptParamsAsObject(process.argv)

//give priority to one or the other
slackChannelIds = slackChannelIdsFromUserProps || RNRM_uploadAndroidBinary_slackChannelIds
slackToken = slackTokenFromUserProps || RNRM_uploadAndroidBinary_slackToken

//begin
console.log("In uploadAndroidBinary.js")
console.log("upload to slack script will find file in:\n", finalOutputFilePath)

if (!slackChannelIds || !slackToken) {
    console.log("Missing filename or slackChannel/slackToken. Have you specified those?")
    process.exit(1);
}

var proc = spawnSync(`bash`, [
    `${__dirname}/uploadAndroidBinary.sh`,
    `${slackChannelIds}`, //ARGUMENT 1 the slack channels ( comma separated if many)
    `${slackToken}`, //ARGUMENT 2 the slack token
    `${finalOutputFilePath}`, //ARGUMENT 3 , the filepath
], { stdio: 'inherit' })

if (proc.status === 0) {
    console.log(chalk.green("Upload Apk succesfully"))
} else {
    console.log(chalk.red("Upload Apk got an error"))
}