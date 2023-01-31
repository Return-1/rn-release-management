### Instructions


Upon running a command like
`node rnrm/run.js flavor1 production 1.2.0 -d "_some_description`

getContext will return an object that will look like:

```js
{
  cliProps: {
    application: 'flavor1',
    environment: 'production',
    version: '1.2.0',
    description: '',
    outputFileName: 'flavor1Production1.2.0.apk',
    projectPath: '/Users/georgeavgoustis/Desktop/PROJECTS/OTHER/HLDataMobile',
    cliPath: '/Users/georgeavgoustis/Desktop/PROJECTS/OTHER/rn-release-management/steps/getContext'
  },
  userProps: {}
}
```

This is used by all steps, each step receives this whole object and keeps what it needs from it.