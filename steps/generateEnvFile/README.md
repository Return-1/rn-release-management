###  Instructions

This step copies the appropriate .env.[application].[environment].js into env.js.

### PARAMS

`withoutLogs`
default : true 
This will look for the existence of `WITH_LOGS` or `WITH_REDUX_LOGGER` keys in
your env files and set them to false. 
TODO: Instead maybe simply add a console.log = () => {} function to the app somehow 

`shouldObfuscate`
default : false
This will obfuscate the produced env so that cracker's life's are a bit harder
It won't do crazy much right now but it's a start.

### Future : 

Make DEFAULTS.envFilePath and DEFAULTS.envFilePathOutput overrideable