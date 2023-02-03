const {
    getContext,
    //actions
    generateEnvFile,
    generateFilesFromTemplates,
    generateApk,
    generateApkSizeHistory,
    uploadApk,
    tagBranch,
} = require("rn-release-management")
const versioning = require("./versioning")
let context = getContext(process);

//Environment setup
generateEnvFile({
    ...context, userProps: {
        withoutLogs: true,
        shouldObfuscate: false, //todo: change to false soon
    }
});

generateFilesFromTemplates({
    ...context, userProps: {
        autodetect: true,
        injectedChangeData: {
            //your own data
        },
    }
});

//APK generation, uploading and tagging. Usually on release candidate
generateApk(context)
generateApkSizeHistory(context)
uploadApk({
    ...context, userProps: {
        slackToken: "xxxxx",
        slackChannelIds: [
            'xxxxx', //some channel
        ]
    }
})
tagBranch(context);