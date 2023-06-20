argument_1=$1 # slackChannels || serverIPAddress
argument_2=$2 # slackToken || serverUploadDirectory
apkPath=$3
service=$4


set -e # exit immediately if a command exits with a non-zero status

ls -lah $apkPath

## delete previous source maps in case they exist just to be sure
echo -e "====Will upload binary $apk to $argument_1:$argument_2====\n"

if [ $service = "slack" ]
then
    curl -F file=@$apkPath -F channels=$argument_1 -H "Authorization: Bearer $argument_2" https://slack.com/api/files.upload --progress-bar | cat
else 
    scp $apkPath $argument_1:$argument_2
fi

echo -e "====Done uploading===="
