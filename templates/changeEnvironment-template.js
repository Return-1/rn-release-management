const {
    getContext,
    //actions
    generateEnvFile,
    generateFilesFromTemplates,
    generateAppInfoComponent,
} = require("rn-release-management")

getContext(process, false);

//Environment setup
generateEnvFile({ shouldObfuscate: false });
generateFilesFromTemplates();
generateAppInfoComponent()