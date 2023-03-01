const {
    getContext,
    //actions
    isCorrectBranch,
    generateEnvFile,
    generateFilesFromTemplates,
    generateAppInfoComponent,
    generateAndroidBinary,
    generateAndroidBinarySizeHistory,
    uploadAndroidBinary,
    tagBranch,
} = require("rn-release-management")

getContext(process);

isCorrectBranch({ branchName: "master" })
//Environment setup
generateEnvFile({
    withoutLogs: true,
    shouldObfuscate: false, //todo: change to false soon
});

generateFilesFromTemplates();
generateAppInfoComponent()

// Android packaging generation, uploading and tagging. Usually on release candidate
//The packagingFormat property controls the packaging format for the application.
//By default, the packaging format is APK.
//However, to change the packaging format to AAB, you can pass an object with the packagingFormat property and set it to "aab".
//This can be achieved through the following code:
// generateAndroidBinary({
//     packagingFormat: 'aab'
// })

generateAndroidBinary()
generateAndroidBinarySizeHistory()

uploadAndroidBinary({
    slackToken: "xxxxx",
    slackChannelIds: [
        'xxxxx', //some channel
    ]
})

tagBranch();