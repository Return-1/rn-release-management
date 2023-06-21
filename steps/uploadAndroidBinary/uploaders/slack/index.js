function processUploadToSlack() {

    if ((!slackChannelIds || !slackToken) && service === SERVICE.SLACK) {
        console.log("Missing filename or slackChannel/slackToken. Have you specified those?");
    }

    console.log("Uploading to Slack. File location: ", finalOutputFilePath);

    const proc = spawnSync(`bash`, [
        `${__dirname}/uploadAndroidBinary.sh`,
        slackChannelIds, //ARGUMENT 1 the slack channels ( comma separated if many)
        slackToken, //ARGUMENT 2 the slack token
        finalOutputFilePath, //ARGUMENT 3 , the filepath
        SERVICE.SLACK
    ], { stdio: 'inherit' });

    handleOutputMessage(proc.status, 'Slack');
}