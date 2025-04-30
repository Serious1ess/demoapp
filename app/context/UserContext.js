import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { supabase } from "../supabase/supabase";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Register for push notifications
  const registerForPushNotifications = async () => {
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
  };

  // Save session to AsyncStorage
  const saveSession = async (session) => {
    try {
      await AsyncStorage.setItem("userSession", JSON.stringify(session));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  // Get session from AsyncStorage
  const getSession = async () => {
    try {
      const session = await AsyncStorage.getItem("userSession");
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  };

  // Clear session from AsyncStorage
  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem("userSession");
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (user) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const userData = {
        ...user,
        ...profile,
        isBusiness: profile?.is_business || false,
      };

      setUser(userData);

      // Register for push notifications
      const token = await registerForPushNotifications();
      if (token) {
        // Save the push token to your database if needed
        await supabase
          .from("profiles")
          .update({ expo_push_token: token })
          .eq("id", user.id);
      }

      // Subscribe to notifications
      const unsubscribe = subscribeToNotifications(
        userData.id,
        userData.isBusiness
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  // Subscribe to realtime notifications
  const subscribeToNotifications = (userId, isBusiness) => {
    const fetchInitialNotifications = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        let query = supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (isBusiness) {
          query = query
            .eq("business_id", userId)
            .or(
              `and(created_at.gte.${todayISO},created_at.lt.${new Date(
                today.getTime() + 86400000
              ).toISOString()}),and(status.eq.pending,created_at.gt.${todayISO})`
            );
        } else {
          query = query.eq("customer_id", userId).gte("created_at", todayISO);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) setNotifications(data);
      } catch (error) {
        console.error("Error fetching initial notifications:", error);
      }
    };

    fetchInitialNotifications();

    const filterField = isBusiness ? "business_id" : "customer_id";
    const channelName = isBusiness
      ? `business_notifications:${userId}`
      : `customer_notifications:${userId}`;

    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `${filterField}=eq.${userId}`,
        },
        async (payload) => {
          console.log("Change received:", payload);

          const { eventType, new: newData, old: oldData } = payload;

          // Business: notify on INSERT
          if (isBusiness) {
            setNotifications((prev) => [newData, ...prev]);

            if (Platform.OS !== "web") {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "New Appointment Request",
                  body: "You have a new appointment request",
                  data: {
                    screen: "BusinessAppointments",
                    data: newData,
                  },
                },
                trigger: null,
              });
            }
          }
          // console.log(newData);
          // console.log(
          //   !isBusiness &&
          //     eventType === "UPDATE" &&
          //     // oldData?.status !== newData.status &&
          //     ["confirmed", "missed", "canceled", "completed"].includes(
          //       newData.status
          //     )
          // );
          // Customer: notify on UPDATE when status is relevant
          if (
            !isBusiness &&
            eventType === "UPDATE" &&
            // oldData?.status !== newData.status &&
            ["confirmed", "missed", "canceled", "completed"].includes(
              newData.status
            )
          ) {
            setNotifications((prev) => [newData, ...prev]);

            if (Platform.OS !== "web") {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Appointment Update",
                  body: `Your appointment has been ${newData.status}`,
                  data: {
                    screen: "CustomerAppointments",
                    data: newData,
                  },
                },
                trigger: null,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  // Check for existing session on app start
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        setLoading(true);

        // Check if we have a saved session
        const savedSession = await getSession();

        if (savedSession) {
          // Verify with Supabase
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) throw error;

          if (session) {
            await fetchUserProfile(session.user);
            return;
          }
        }

        // If no saved session or invalid, proceed with normal flow
        await fetchSession();
      } catch (error) {
        console.error("Session check error:", error);
        await clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active" && user) {
          // Refresh session when app comes to foreground
          try {
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();
            if (error) throw error;

            if (session && user.id !== session.user.id) {
              await fetchUserProfile(session.user);
            }
          } catch (error) {
            console.error("App state session refresh error:", error);
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [user]);

  // Main session fetch function
  const fetchSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        await saveSession(session);
        await fetchUserProfile(session.user);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      await clearSession();
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await clearSession();
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.dismissAllNotificationsAsync();

      setUser(null);
      setNotifications([]);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        notifications,
        setNotifications,
        refetchUser: () => user && fetchUserProfile(user),
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
