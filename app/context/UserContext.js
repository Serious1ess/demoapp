import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase"; // Import your Supabase client

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

        // If the user is a business, subscribe to notifications
        if (profile?.is_business) {
          console.log("User is business, subscribing to notifications..."); // Debugging Log
          const unsubscribe = subscribeToNotifications(userData.id);
          console.log("user.id", userData.id);
          return unsubscribe; // Cleanup when component unmounts
        }
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

  // Function to subscribe to business notifications
  const subscribeToNotifications = (businessId) => {
    console.log("Subscribing to notifications for business:", businessId);

    // 1. Fetch initial notifications
    const fetchInitialNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setNotifications(data);
      } catch (error) {
        console.error("Error fetching initial notifications:", error);
      }
    };

    fetchInitialNotifications();

    // 2. Set up realtime subscription
    const subscription = supabase
      .channel(`business_notifications:${businessId}`) // Simplified channel name
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "notifications",
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          console.log("Change received:", payload);
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
            alert("New appointment request received!");
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
          // Add retry logic here if needed
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
      value={{ user, setUser, loading, logout, notifications }}>
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
