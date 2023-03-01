const {
    getContext,
    //actions
    generateEnvFile,
    generateFilesFromTemplates,
    generateAppInfoComponent,
} = require("rn-release-management")

getContext(process);

//Environment setup
generateEnvFile({ shouldObfuscate: false });
generateFilesFromTemplates();
generateAppInfoComponent()