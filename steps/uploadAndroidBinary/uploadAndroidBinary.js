const { getScriptParamsAsObject } = require("../../helpers")
const { processUploadToSlack } = require('./uploaders/slack/index')
const { processUploadToServer } = require('./uploaders/scp/index');


let { cliProps: {
    finalOutputFilePath
}, userProps: {
    slackChannelIds: slackChannelIdsFromUserProps,
    slackToken: slackTokenFromUserProps,
    serverIPAddress: serverIPAddressFromUserProps,
    serverUploadDirectory: serverUploadDirectoryFromUserProps
}, envProps: {
    RNRM_uploadAndroidBinary_slackChannelIds,
    RNRM_uploadAndroidBinary_slackToken,
    RNRM_uploadAndroidBinary_serverIPAddress,
    RNRM_uploadAndroidBinary_serverUploadDirectory,
} } = getScriptParamsAsObject(process.argv)

//slack
slackChannelIds = slackChannelIdsFromUserProps || RNRM_uploadAndroidBinary_slackChannelIds;
slackToken = slackTokenFromUserProps || RNRM_uploadAndroidBinary_slackToken;

//scp
serverIPAddress = serverIPAddressFromUserProps || RNRM_uploadAndroidBinary_serverIPAddress;
serverUploadDirectory = serverUploadDirectoryFromUserProps || RNRM_uploadAndroidBinary_serverUploadDirectory;

console.log("In uploadAndroidBinary.js");
processUploadToServer(serverIPAddress, serverUploadDirectory, finalOutputFilePath);
processUploadToSlack(slackChannelIds, slackToken, finalOutputFilePath);

