function processUploadToServer(serverIPAddress, serverUploadDirectory) {
    //validate inputs
    if ((!serverIPAddress || !serverUploadDirectory) && service === SERVICE.SERVER) {
        console.log("Missing filename or serverIPAddress/serverUploadDirectory. Have you specified those?");
    }

    console.log("Uploading to server. File location: ", finalOutputFilePath);

    const proc = spawnSync(`bash`, [
        `${__dirname}/uploadAndroidBinary.sh`,
        serverIPAddress, // ARGUMENT 1: the server IP address
        serverUploadDirectory, // ARGUMENT 2: the server upload directory
        finalOutputFilePath, // ARGUMENT 3: the file path
        SERVICE.SERVER
    ], { stdio: 'inherit' });

    handleOutputMessage(proc.status, 'Server');
}