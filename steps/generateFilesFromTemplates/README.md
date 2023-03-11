### Instructions

This step does a couple of things based on params but basically it generates files from `.rnrmtemplate` template files that have placeholder values in them like %%BASE_URL%% or %%SOME_TOKEN%%. This way we can make sure all our envs are in one place, .env, and not need to worry about changing native files like .plists and so on.

This also helps with automatically setting the versions in the plist and gradle files. It can do a lot.

### Parameters

`autodetect`
default : true

If this is on, it will detect files with the `.rnrmtemplate` extension and generate files without that extension where placeholders have been changed to values found in .env or in custom-provided-values.

An example : add example here

`injectedChangeData`
default: {}

Normally data to change is taken from the .env file. In the event we want to provide custom data to replace the placeholders in the `.rnrmtemplate` files we can do it here.

Example : 

`files`
default : []

This is advanced so you likely don't need this. Files is an array provided as shown below. It's purpose is to hook in th process and provide custom `.rnrmtemplate` files that will go through the transformation process. If autodetect is true, this will take precedence. 

```js
files: [
    {
        filePath: string,
        changeData: [
            { stringToReplace: string, replaceWith: string },
            { stringToReplace: string, replaceWith: string },
        ]
    },
    ...
]
```


Work on files provided
1. WILL WORK ON FILES PROVIDED, FILES HAVE FORMAT AS IN SEE generateFilesFromTemplates API
// 2. (OPTIONAL) WILL ALSO AUTODETECT TEMPLATES AND REPLACE WITH ENV VARIABLES IN ENV.JS FILE IF AUTODETECT
// IS ENABLED 