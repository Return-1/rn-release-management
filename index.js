const { getContext } = require("./steps/getContext/getContext")
const { runStep } = require('./helpers')

module.exports = {
    getContext,
    generateEnvFile: (context) => {
        runStep({
            scriptName: "generateEnvFile",
            params: context, //TODO: MISSING WITHLOGS
            successMessage: "env.js generatated successfully", failMessage: "!!! There was an error while generating the envs",
        })
    },
    generateApk: (context) => {
        runStep({
            scriptName: "generateApk",
            params: context,
            successMessage: "APKs generated succesfully", failMessage: "!!! There was an error while generating the apks"
        })
    },
    generateApkSizeHistory: (context) => {
        runStep({
            scriptName: "generateApkSizeHistory",
            params: context,
            successMessage: "History apk size has been succesfully created", failMessage: "!!! There was an error while writing the  history apk size",
        })
    },
    generateFilesFromTemplates: (context) => {
        runStep({
            scriptName: "generateFilesFromTemplates",
            params: context,
            successMessage: "Template files have generated the native files accordingly", failMessage: "!!! There was an error while generating the native files from templates",
        })
    },
    uploadApk: (context) => {
        runStep({
            scriptName: "uploadApk",
            params: context,
            successMessage: "Apk uploaded succesfully to slack channel", failMessage: "Error uploading apk to slack"
        })
    },
}