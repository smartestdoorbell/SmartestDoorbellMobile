import React from "react";
import { Text, View, FlatList } from "react-native";

import StreamView from "./StreamView";
import History from "./History";
import { Permissions, Notifications } from "expo";
const PUSH_REGISTRATION_ENDPOINT =
  "https://pidoorbellserver.herokuapp.com/token";
const MESSAGE_ENPOINT = "https://pidoorbellserver.herokuapp.com/message";

export default class App extends React.Component {
  state = {
    notification: null,
    messageText: "",
    View: "Video"
  };

  handleNotification = notification => {
    this.setState({ notification });
  };

  async handlePress(word) {
    await this.setState({ View: word });
  }

  registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: {
          value: token
        },
        user: {
          username: "warly",
          name: "Dan Ward"
        }
      })
    });

    this.notificationSubscription = Notifications.addListener(
      this.handleNotification
    );
  };

  renderNotification() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>A new message was recieved!</Text>
        <Text>{this.state.notification.data.message}</Text>
      </View>
    );
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <View
          style={{
            flex: 0.2,
            flexDirection: "row",
            backgroundColor: "#6196ed",
            marginTop: 17,
            padding: 10,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{ padding: 30, margin: 20, backgroundColor: "#156af2" }}
            onPress={() => {
              this.handlePress("Video");
            }}
          >
            Video
          </Text>

          <Text
            style={{ padding: 30, margin: 20, backgroundColor: "#156af2" }}
            onPress={() => {
              this.handlePress("History");
            }}
          >
            History
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {this.state.View === "Video" ? (
            <StreamView style={{ flex: 1 }} />
          ) : (
            <History />
          )}
        </View>
        {this.state.notification ? this.renderNotification() : null}
      </View>
    );
  }
}
