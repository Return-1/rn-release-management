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
    generateEnvFile: wrapInRunStep("generateEnvFile"),
    generateBinaryAndroid: wrapInRunStep("generateBinaryAndroid"),
    generateAppSizeHistory: wrapInRunStep("generateAppSizeHistory"),
    generateFilesFromTemplates: wrapInRunStep("generateFilesFromTemplates"),
    tagBranch: wrapInRunStep("tagBranch"),
    uploadApp: wrapInRunStep("uploadApp"),
    //less important
    generateAppInfoComponent: wrapInRunStep("generateAppInfoComponent"),
    //helpers,
    wrapWithContext,
}