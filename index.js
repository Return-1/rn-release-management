const { getContext } = require("./steps/getContext/getContext")
const { runStep, wrapWithContext } = require('./helpers')

const wrapInRunStep = (scriptName, successMessageOverride, errorMessageOverride) => {
    return context => runStep({
        scriptName: scriptName,
        params: context, //TODO: MISSING WITHLOGS
        successMessage: `${scriptName} executed succefully`, failMessage: `!!!! ${scriptName} step failed !!!!!!!`,
    })
}

module.exports = {
    getContext,
    isCorrectBranch: wrapInRunStep("isCorrectBranch"),
    generateEnvFile: wrapInRunStep("generateEnvFile"),
    generateAndroidBinary: wrapInRunStep("generateAndroidBinary"),
    generateAndroidBinarySizeHistory: wrapInRunStep("generateAndroidBinarySizeHistory"),
    generateFilesFromTemplates: wrapInRunStep("generateFilesFromTemplates"),
    tagBranch: wrapInRunStep("tagBranch"),
    uploadAndroidBinary: wrapInRunStep("uploadAndroidBinary"),
    commitAndPushVersionBump: wrapInRunStep("commitAndPushVersionBump"),
    //less important
    generateAppInfoComponent: wrapInRunStep("generateAppInfoComponent"),
    //helpers,
    wrapWithContext,
}