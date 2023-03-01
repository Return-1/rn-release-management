const {
    getContext,
    //actions
    isCorrectBranch,
    generateEnvFile,
    generateFilesFromTemplates,
    generateAppInfoComponent,
    generateAndroidBinary,
    generateApkSizeHistory,
    uploadAndroidBinary,
    tagBranch,
} = require("rn-release-management")
let context = getContext(process);

isCorrectBranch({ branchName: "master" })
//Environment setup
generateEnvFile({
    withoutLogs: true,
    shouldObfuscate: false, //todo: change to false soon
});

generateFilesFromTemplates();
generateAppInfoComponent()

//APK generation, uploading and tagging. Usually on release candidate
generateAndroidBinary()
generateApkSizeHistory()

uploadAndroidBinary({
    slackToken: "xxxxx",
    slackChannelIds: [
        'xxxxx', //some channel
    ]
})
tagBranch(context);