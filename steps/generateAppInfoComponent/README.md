### Instructions 

This step will generate three files in the project's `rnrm/RNRMAppInfo` directory:

`commitData.js` - contains commit data filtered by the commitsFilter parameter as well as other Git information for the past two months.
`systemInfo.js` - contains general system information so we know which machine built the binary.
`RNRMAppInfo.js` - imports the `commitData.js` and `systemInfo.js` files and includes general app and build information.

### Motivation

It's helpful to know exactly when a certain commit was included in a built app, which machine built it, and what version it is.

### Run step example

```js
generateAppInfoComponent({
    ...context, userProps: {
        commitsFilter: "some filter"
    }
})
```

### Params

`commitsFilter` - This parameter is optional. If it is not provided, the filter will not be applied.

### TODO
-Add a simple searchbar in RNRMAppInfo for commits
-Group commits by date (add header) and make them look better