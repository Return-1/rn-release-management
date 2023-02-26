### Instructions 

This step will do the following :
1. Create a .js file in `<projectRoot>/rnrm/RNRMAppInfo/commitData.js` that has 2 months worth of commit data filtered by the `commitsFilter` parametered passed in this step as well as other git information
2. Create a .js file in `<projectRoot>/rnrm/RNRMAppInfo/systemInfo.js` that has general system info so we know which machine has build the binary.
3. Create a file in `<projectRoot>/rnrm/RNRMAppInfo/RNRMAppInfo.js` that will import the `commitData.js` file and the and `systemInfo.js` file and include general app and build information.

### Motivation

It would be good to know for certain when a certain commit has made it into the built app, which machine build it, what version it is etc

### Run step example

```js
generateAppInfoComponent({
    ...context, userProps: {
        commitsFilter: "some filter"
    }
})
```

### Params

`commitsFilter`
If this is empty it is not applied

### TODO
-Add a simple searchbar in RNRMAppInfo for commits
-Group commits by date (add header) and make them look better