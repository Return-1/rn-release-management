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

**iOS (WIP)**
nothing here yet but you can use changeEnvironment in your build scripts

# Setting up

Clone this project on the same folder level as your project.

`cd rn-release-management` and run`npm install` then `npm link`
then go to your project and run `npm link rn-release-management`
### Env files

A core concern of this library is making sure that you only need to set your env variables in one place and need not concern yourself with making sure your native files ( such as plist files ) or your build flavor have included the right environment. In your `.js` files, all you need to do is import a main `env.js` file from `src/env.js` and this library will make sure that file's contents are as needed.

You have set up an `/envs` folder that lives in `..rootOfYourProject/src/envs` and the env filenames look like
`env.<appName><appEnvironment>`

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

Run `rnrm init` and this will create some files needed from this library to operate.

# Recipes
Currently by default `/rnrm` contains two recipies ( which is nothing more than a series of commonly used steps for changing the environment or building and distributing your android app privately)

### I wanna change my environment
`node rnrm/changeEnvironment.js [flavorName] [environment]` 

`node rnrm/releaseAndroid.js [flavorName] [environment] x.x.x "some description"`

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

!!!!
!!!!
1. We need to have a centralized concept of versioning as right now command line version ( which is only used for naming and config.js version do not align in any way.)
!!!!
!!!!

2. Maybe add commit from which version was built and branch in ENV

2. Make it work even without flavors. Prompt if no flavor/environment combo is provided with info saying it is suggested to do so

3. Save a list of commits in the device all that have a prefix of COMPANYNAMEDEVEL_xxxx where xxxx is the number of the ticket so we know what each version has in it. Can even create an importable React Native screen for that and place it in /rnrm or overrideable folder. This screen will also have version number information ( taken from DeviceInfo of course ) and other developer friendly stuff. Ideally searchable commits. That sounds pretty wild. Make the array of data be kinda easy to copy paste. Maybe make this a component not a screen.

4. Hash envs should also be here as a step so devs know what they don't have in common. Make it also per file not one huge file and put them in the envHashes folder ( if not exist then create )

5. Step to get current version from store.
ios : let requestURL = "https://itunes.apple.com/lookup?bundleId=\(bundleId)" ( it works i checked ). Maybe even make a releases tab for this.

### Low prio/later:
-2 Instead of requiring a buttload of steps it would be better to just require RNRM and imperatively call the steps like RNRM.generateEnv(context)
-3 building on iOS
-5 DEFAULTS should be overrideable in scripts.config.js
-6 should make envData be better. Etc. be allowed to add comments on first line etc and parse it better. Additionally now config.js in rnrm is of the same const envData = format cause it's convenient but should change that. 
-8 generate apk size history default and overrideable log output location
-instruct users to make index.js into index.rnrm-template.js so that we can kill logs centrally.

## Concerns migrating from our current build system

Why not provide version in cli anymore?
> Because you can't easily see the commit history, only after the fact. It's better to be changing it centrally after seeing exactly what the previous version was. Description is still allowed.

Why use .rnrmtemplate files instead of file tags like before?
> Basically previous attempt was faulty in .plist files that were stripping extra comments and xcode is generally messing around. Also, this is a lot easier to code and maintain and clearer as to what changes are being made by a simple file diffing approach.

Also:
-We should probably only use the capitalized version of the environment to avoid confusion so for exmaple Production and Preview. As such it would be best to rename envs accordingly so like : 
`env.appName.Preview.js`