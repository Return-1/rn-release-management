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