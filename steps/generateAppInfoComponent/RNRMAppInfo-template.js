import React from "react";
import { View, Text, ScrollView } from "react-native";
import DeviceInfo from 'react-native-device-info';

import { commitData, branchName } from "./commitData"
import { systemInfo } from "./systemInfo.js"



const RNRMAPPInfo = () => {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>

                <Warning />

                <Header title={"App Information"} />
                <AppInformation />

                <Header title={"Commit Data , 2 months"} />
                <CommitData />

            </ScrollView>
        </View>
    )
}

const Warning = () => {
    return <Text style={{ color: "red", fontWeight: "bold" }}>
        {`This is a developer screen.
If you're seeing this we would appreciate it if you could contact support as it is a bug with our application.
    `}
    </Text>
}

const Header = ({ title }) => {
    return <Text style={{ marginVertical: 10, fontWeight: "bold", fontSize: 20, backgroundColor: "#E0E0E0" }}>{title}</Text>
}

const AppInformation = () => {

    return (<>
        <LabelValue label={"Device info"} value={DeviceInfo.getBundleId()} />
        <LabelValue label={"Build number"} value={DeviceInfo.getBuildNumber()} />
        <LabelValue label={"Version"} value={DeviceInfo.getVersion()} />
        <LabelValue label={"Environment"} value={"WIP"} />
        <Text style={{ fontWeight: "bold" }}>{"This app was build on :"}</Text>
        <Text>{"System that build this app"}</Text>
        <Text>{JSON.stringify(systemInfo, null, 4)}</Text>
    </>)
}

const CommitData = () => {
    return <>
        <LabelValue label={"Branch name"} value={branchName} />
        {commitData.map((item, index) => {
            return <Text>{index + " >>> " + item}</Text>
        })}

    </>
}

const LabelValue = ({ label, value }) => {
    return <Text style={{ fontWeight: "bold" }}>{label + " : "} <Text style={{ fontWeight: "normal" }}>{value}</Text></Text>
}

export default RNRMAPPInfo