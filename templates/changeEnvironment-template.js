const {
    getContext,
    //actions
    generateEnvFile,
} = require("rn-release-management")
let context = getContext(process);

//Environment setup
generateEnvFile({
    ...context, userProps: {
        shouldObfuscate: false,
    }
});