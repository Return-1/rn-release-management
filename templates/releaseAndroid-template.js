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

//Android packaging generation, uploading and tagging. Usually on release candidate
//The packagingFormat property controls the packaging format for the application.
//By default, the packaging format is apk.To change the packaging format to aab, 
//uncomment the packagingFormat property and set it to "aab":
generateAndroidBinary()
generateApkSizeHistory()

uploadAndroidBinary({
    slackToken: "xxxxx",
    slackChannelIds: [
        'xxxxx', //some channel
    ]
})

tagBranch(context);