const { spawnSync } = require('child_process');
const { SERVICE, handleOutputMessage } = require('../../helpers');

function processUploadToSlack(slackChannelIds, slackToken, finalOutputFilePath) {

    if (!slackChannelIds || !slackToken) {
        console.log("Missing filename or slackChannel/slackToken. Have you specified those?");
        return
    }

    console.log("Uploading to Slack. File location: ", finalOutputFilePath);

    const proc = spawnSync(`bash`, [
        `${__dirname}/slackUpload.sh`,
        slackChannelIds, //ARGUMENT 1 the slack channels ( comma separated if many)
        slackToken, //ARGUMENT 2 the slack token
        finalOutputFilePath, //ARGUMENT 3 , the filepath
    ], { stdio: 'inherit' });

    handleOutputMessage(proc.status, SERVICE.SLACK);
}


module.exports = {
    processUploadToSlack
}