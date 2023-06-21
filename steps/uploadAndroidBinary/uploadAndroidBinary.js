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
    RNRM_uploadAndroidBinary_serverIPAddress,
    RNRM_uploadAndroidBinary_serverUploadDirectory,
} } = getScriptParamsAsObject(process.argv)

//slack
const slackChannelIds = slackChannelIdsFromUserProps || RNRM_uploadAndroidBinary_slackChannelIds;
const slackToken = slackTokenFromUserProps || RNRM_uploadAndroidBinary_slackToken;

//scp
const serverIPAddress = serverIPAddressFromUserProps || RNRM_uploadAndroidBinary_serverIPAddress;
const serverUploadDirectory = serverUploadDirectoryFromUserProps || RNRM_uploadAndroidBinary_serverUploadDirectory;

console.log("In uploadAndroidBinary.js");
processUploadToSlack(slackChannelIds, slackToken);
processUploadToServer(serverIPAddress, serverUploadDirectory);

//TODO: export this one to use in index.js files from a helpers.js
function handleOutputMessage(status, service) {
    if (status === 0) {
        console.log(chalk.green(`Apk uploaded successfully to ${service}`));
    } else {
        console.log(chalk.red("Error occurred during Apk upload"));
        process.exit(1);
    }
}
