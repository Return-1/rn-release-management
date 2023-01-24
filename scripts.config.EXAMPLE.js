//The allowed flavor applications z
const allowedApps = {
    applicationFlavor1: "applicationFlavor1",
    applicationFlavor2: "applicationFlavor2",
}

//The allowed ennvironments
const allowedEnvironments = {
    staging: "staging",
    production: "production",
}

const slackToken = "some_token";
const slackChannelIds = "x,y,z"

const functionToRun = () => {
    console.log("test function provided by user", process.env.PWD)
}

module.exports = {
    allowedEnvironments,
    allowedApps,
    slackToken,
    slackChannelIds,
    functionToRun,
}