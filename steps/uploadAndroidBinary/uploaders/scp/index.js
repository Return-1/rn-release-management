const { spawnSync } = require('child_process');
const { SERVICE, handleOutputMessage } = require('../../helpers');

function processUploadToServer(serverIPAddress, serverUploadDirectory, finalOutputFilePath) {

    //validate inputs
    if (!serverIPAddress || !serverUploadDirectory) {
        console.log("Missing filename or serverIPAddress/serverUploadDirectory. Have you specified those?");
        return
    }

    console.log("Uploading to server. File location: ", finalOutputFilePath);

    const proc = spawnSync(`bash`, [
        `${__dirname}/scpUpload.sh`,
        serverIPAddress, // ARGUMENT 1: the server IP address
        serverUploadDirectory, // ARGUMENT 2: the server upload directory
        finalOutputFilePath, // ARGUMENT 3: the file path
    ], { stdio: 'inherit' });

    handleOutputMessage(proc.status, SERVICE.SERVER);
}

module.exports = {
    processUploadToServer
}