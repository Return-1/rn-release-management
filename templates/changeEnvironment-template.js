const {
    getContext,
    //actions
    generateEnvFile,
    generateFilesFromTemplates,
    generateAppInfoComponent,
} = require("rn-release-management")
let context = getContext(process);

//Environment setup
generateEnvFile({
    ...context, userProps: {
        shouldObfuscate: false,
    }
});

generateFilesFromTemplates(context);
generateAppInfoComponent(context)