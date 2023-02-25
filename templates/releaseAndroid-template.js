const {
    getContext,
    //actions
    generateEnvFile,
    generateFilesFromTemplates,
    generateAppInfoComponent,
    generateBinaryAndroid,
    generateAppSizeHistory,
    uploadApp,
    tagBranch,
} = require("rn-release-management")
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

generateAppInfoComponent({
    ...context, userProps: {
        filter: "NVDEVEL"
    }
})

//Android packaging generation, uploading and tagging. Usually on release candidate
//The packagingFormat property controls the packaging format for the application.
//By default, the packaging format is apk.To change the packaging format to aab, 
//uncomment the packagingFormat property and set it to "aab":
generateBinaryAndroid({
    ...context, userProps: {
        // packagingFormat: "aab",
    }
})

generateAppSizeHistory(context)

uploadApp({
    ...context, userProps: {
        slackToken: "xxxxx",
        slackChannelIds: [
            'xxxxx', //some channel
        ]
    }
})

tagBranch(context);