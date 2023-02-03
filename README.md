# What this tool provides for you

This cli tool provides you with a series of useful steps that can be run to automate your mobile releases and manage your environment variables in one place. Flavor friendly.

Current features:

**Both platforms (ios,android):**
- managing envs so don't need to worry if your build variant has the right env file included
- using env files to make sure your native files are properly configured (e.g plists)
- tag branch on build

**Android only:**
- building the proper flavor/environment combination on Android (apk only soon aab)
- Keeping a log of how your apk size changes per build so bloat doesn't sneak up on you
- Storing all your binaries (apks,aabs) in a folder so you've got access to them
- Upload your apk to a slack channel

# Setting up
### Env files

A core concern of this library is making sure that you only need to set your env variables in one place and need not concern yourself with making sure your native files ( such as plist files ) or your build flavor have included the right environment. In your .js files, all you need to do is import a main env.js file from src/env.js and this library will make sure that file's contents are as needed.

You have set up an /envs folder that lives in /src/envs and the env filenames look like
env.<appName><appEnvironment>

The env file contents are expected to look like :
```js
const envData = {
    key1: asdad, //whatever
}
export default envData
```

### Flavors

We're currently making the assumption that you've got set up flavors on Android
You have setup flavors on android/app/build.gradle file that look like
[appName][appEnvironment(e.g staging|production|whatever)]

### Initializing

Run `rnrm.js --init` and this will create some files needed from this library to operate.

# Recipes
Currently by default `/rnrm` contains two recipies ( which is nothing more than a series of commonly used steps for changing the environment or building and distributing your android app privately)

### I wanna change my environment
`node rnrm/changeEnvironment.js flavorName environment` 

`node rnrm/releaseAndroid.js flavorName environment x.x.x "some description"`

### Available Steps to make your own recipe

You can see the documentation of each individual step in the `/steps` folder

`getContext`

`generateEnvFile`

`generateFilesFromTemplates`

`generateApk`

`generateApkSizeHistory`

`uploadApk`

`tagBranch`

# Future work :

### High prio
1. Currently there's this issue where version provided by the cli is not respected, it's only used as a description, so find a way to unify that and see if it should be the versioning.js file that should be respected/incremented or not.

2. Make it work even without flavors. Prompt if no flavor/environment combo is provided with info saying it is suggested to do so

3. Save a list of commits in the device all that have a prefix of COMPANYNAMEDEVL_xxxx where xxxx is the number

### Low prio/later:
-3 building on iOS
-4STEP: uploading apk ssh
-5 DEFAULTS should be overrideable in scripts.config.js
-6 should make envData be allowed to add comments on first line etc and parse it better
-7 Is there really any reason to have the envs be env.flavorName.envName.js instead of going for the complete final variant like say <appName><envName>.env.js? This would help the code not need the capitalize function
-8 generate apk size history default and overrideable log output location