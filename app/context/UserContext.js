import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        const userData = {
          ...session.user,
          ...profile,
          isBusiness: profile?.is_business || false,
        };

        setUser(userData);

        // Subscribe to notifications based on user type
        console.log(
          "User is",
          userData.isBusiness ? "business" : "customer",
          "subscribing to notifications..."
        );
        const unsubscribe = subscribeToNotifications(
          userData.id,
          userData.isBusiness
        );
        return unsubscribe; // Cleanup when component unmounts
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
      console.log("loading false");
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // Function to subscribe to notifications
  const subscribeToNotifications = (userId, isBusiness) => {
    console.log(
      `Subscribing to notifications for ${
        isBusiness ? "business" : "customer"
      }:`,
      userId
    );

    // 1. Fetch initial notifications
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

    // 2. Set up realtime subscription
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
        (payload) => {
          console.log("Change received:", payload);
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
            if (isBusiness) {
              alert("New appointment request received!");
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
        console.log("Subscription status:", status);
      });

    // 3. Proper cleanup
    return () => {
      console.log("Unsubscribing from notifications...");
      supabase
        .removeChannel(subscription)
        .then(() => console.log("Unsubscribed successfully"))
        .catch((err) => console.error("Error unsubscribing:", err));
    };
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
