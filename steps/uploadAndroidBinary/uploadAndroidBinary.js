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

const slackChannelIds = slackChannelIdsFromUserProps || RNRM_uploadAndroidBinary_slackChannelIds;
const slackToken = slackTokenFromUserProps || RNRM_uploadAndroidBinary_slackToken;
const serverIPAddress = serverIPAddressFromUserProps || RNRM_uploadAndroidBinary_serverIPAddress;
const serverUploadDirectory = serverUploadDirectoryFromUserProps || RNRM_uploadAndroidBinary_serverUploadDirectory;

const uploadToSlack = !!slackChannelIds && !!slackToken;
const uploadToServer = !!serverIPAddress && !!serverUploadDirectory;
const uploadToSlackAndServer = uploadToSlack && uploadToServer;

const SERVICE = {
    SLACK: 'slack',
    SERVER: 'server'
};

console.log("In uploadAndroidBinary.js");

if (uploadToSlackAndServer) {
    processUploadToSlack();
    processUploadToServer();
} else if (uploadToSlack) {
    processUploadToSlack();
} else if (uploadToServer) {
    processUploadToServer();
} else {
    console.log(chalk.red("Something went wrong!"));
    process.exit(1);
}

function processUploadToSlack() {
    console.log("Uploading to Slack. File location: ", finalOutputFilePath);
    handleValidationMessage(SERVICE.SLACK);

    const proc = spawnSync(`bash`, [
        `${__dirname}/uploadAndroidBinary.sh`,
        slackChannelIds, //ARGUMENT 1 the slack channels ( comma separated if many)
        slackToken, //ARGUMENT 2 the slack token
        finalOutputFilePath, //ARGUMENT 3 , the filepath
        SERVICE.SLACK
    ], { stdio: 'inherit' });

    handleOutputMessage(proc.status, 'Slack');
}

function processUploadToServer() {
    console.log("Uploading to server. File location: ", finalOutputFilePath);
    handleValidationMessage(SERVICE.SERVER);

    const proc = spawnSync(`bash`, [
        `${__dirname}/uploadAndroidBinary.sh`,
        serverIPAddress, // ARGUMENT 1: the server IP address
        serverUploadDirectory, // ARGUMENT 2: the server upload directory
        finalOutputFilePath, // ARGUMENT 3: the file path
        SERVICE.SERVER
    ], { stdio: 'inherit' });

    handleOutputMessage(proc.status, 'Server');
}

function handleValidationMessage(service) {
    if ((!slackChannelIds || !slackToken) && service === SERVICE.SLACK) {
        console.log("Missing filename or slackChannel/slackToken. Have you specified those?");
    }

    if ((!serverIPAddress || !serverUploadDirectory) && service === SERVICE.SERVER) {
        console.log("Missing filename or serverIPAddress/serverUploadDirectory. Have you specified those?");
    }
    process.exit(1);
}

function handleOutputMessage(status, service) {
    if (status === 0) {
        console.log(chalk.green(`Apk uploaded successfully to ${service}`));
    } else {
        console.log(chalk.red("Error occurred during Apk upload"));
        process.exit(1);
    }
}
