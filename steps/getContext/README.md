### Instructions

Upon running a command like :
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
    projectPath: '/Users/.../YOUR_PROJECT',
    cliPath: '/Users/../rn-release-management/steps/getContext' ????IS THIR RIGHT?
  },
  userProps: {}
}
```

This is used by all steps, each step receives this whole object and keeps what it needs from it.