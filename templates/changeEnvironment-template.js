const {
    getContext,
    //actions
    generateEnvFile,
} = require("rn-release-management")
const versioning = require("./versioning")
let context = getContext(process);

//Environment setup
generateEnvFile({
    ...context, userProps: {
        shouldObfuscate: false,
    }
});