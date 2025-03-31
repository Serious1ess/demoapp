import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase"; // Import your Supabase client

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.log(session);
        setUser({
          ...session.user,
          ...profile,
          isBusiness: profile?.is_business || false,
        });
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
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (session?.user) {
  //       const { data: profile, error } = await supabase
  //         .from("profiles")
  //         .select("*")
  //         .eq("id", session.user.id)
  //         .single();

  //       if (error) console.error("Profile fetch error:", error);

  //       setUser({
  //         ...session.user,
  //         ...(profile || {}),
  //         isBusiness: profile?.is_business || false,
  //       });
  //     } else {
  //       setUser(null);
  //     }
  //   });

  //   return () => subscription?.unsubscribe();
  // }, []);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
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
