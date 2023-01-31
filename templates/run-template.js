const {
    getContext,
    generateEnvFile,
    generateFilesFromTemplates,
    generateApk,
    generateApkSizeHistory,
    uploadApk,
} = require("rn-release-management")
const versioning = require("./versioning")

let context = getContext(process);

generateEnvFile(context);
generateFilesFromTemplates({
    ...context, userProps: {
        autodetect: true,
        injectedChangeData: {
            MARKETING_VERSION_PATIENT: versioning.patientMarketingVersion,
            CURRENT_PROJECT_VERSION_PATIENT: versioning.patientCurrentVersion,
            MARKETING_VERSION_DOCTOR: versioning.doctorMarketingVersion,
            CURRENT_PROJECT_VERSION_DOCTOR: versioning.doctorCurrentVersion,
        },
    }
});
generateApk(context)
generateApkSizeHistory(context)
uploadApk({
    ...context, userProps: {
        slackToken: "xoxp-3166338270144-4424826880915-4701727948689-a54a6434210c8f04210aa7868405e150",
        slackChannelIds: [
            // 'D04CKC1D27N', //channel between geav and Bill, will post as myself not the bot
            "D04CA9SPSLE", //channel of me
        ]
    }
})