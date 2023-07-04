const chalk = require('chalk');

const SERVICE = {
    SLACK: 'slack',
    SERVER: 'server'
};

const handleOutputMessage = (status, service) => {
    if (status === 0) {
        console.log(chalk.green(`Apk uploaded successfully to ${service}`));
    } else {
        console.log(chalk.red("Error occurred during Apk upload"));
        process.exit(1);
    }
}

module.exports = {
    SERVICE,
    handleOutputMessage,
}