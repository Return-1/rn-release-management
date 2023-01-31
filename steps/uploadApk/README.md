### Instructions

In your project, call this step as follows

```js
const { uploadApk,} = require("rn-release-management")

uploadApk({
    ...context, userProps: {
        slackToken: "your slack token here", //required
        slackChannelIds: ["your slack channel ids here"] //required
    }
})
```