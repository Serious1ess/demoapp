import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  // Register device for push notifications
  registerForPushNotifications: async () => {
    if (!Device.isDevice) {
      console.warn("Must use physical device for Push Notifications");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo push token:", token);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  },

  // Schedule a local notification
  showNotification: async (title, body, data = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        vibrate: [0, 250, 250, 250],
      },
      trigger: null, // Send immediately
    });
  },

  // Handle notification tap (navigation)
  setupNotificationHandlers: (navigation) => {
    // Listener for notifications received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    // Listener for notification responses (user taps on notification)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped notification:", response);
        // Navigate based on notification data
        const { data } = response.notification.request.content;
        if (data?.screen) {
          navigation.navigate(data.screen, data.params);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  },

  // Get initial notification (when app is launched from notification)
  getInitialNotification: async () => {
    return await Notifications.getLastNotificationResponseAsync();
  },
};
