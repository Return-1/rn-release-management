slackChannels=$1
slackToken=$2
apkPath=$3

ls -lah $apkPath

## delete previous source maps in case they exist just to be sure
echo -e "====Will upload apk $apk to $slackChannels====\n"
curl -F file=@$apkPath -F channels=$slackChannels -H "Authorization: Bearer $slackToken" https://slack.com/api/files.upload
echo -e "\n Uploaded "
