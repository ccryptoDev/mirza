/* eslint-disable*/
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getApplicationInfo, updateApplicationInfo } from "../api/application";

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ isAuthorized: false, data: null });
  const [loading, setLoading] = useState(true);
  const [screenId, setScreenId] = useState("");
  const [error, setError] = useState(null); //  useState({ message: '' });
  const { pathname } = useLocation();

  // FETCH USER AUTH
  async function fetchUserData() {
    const screenId = getScreenId();
    // USE APPLICATION ID TO FETCH DATA
    setLoading(true);
    const result = await getApplicationInfo(screenId);
    if (result && result.data && !result.error) {
      setUser({ data: result.data, isAuthorized: true });
    } else if (result.error) {
      setError({ message: "server error" });
      setUser({ data: null, isAuthorized: false });
    }
    setLoading(false);
  }

  const getScreenId = () => {
    const array = pathname.split("/");
    const id = array[array.length - 1];
    if (screenId !== id) {
      setScreenId(id);
    }
    return id;
  };

  const goToPage = async (path) => {
    const screenId = getScreenId();
    const payload = {
      screenId,
      currentScreen: path,
    };
    await updateApplicationInfo(payload);
    await fetchUserData();
  };

  // INIT
  useEffect(() => {
    // GET APPLICATION ID
    fetchUserData();
  }, []);

  const expose = {
    user,
    loading,
    error,
    isAuthorized: user?.isAuthorized,
    lastLevel: user?.data?.screenTracking?.lastLevel || "",
    setUser,
    setLoading,
    setError,
    goToPage,
    screenId,
    fetchUser: fetchUserData,
  };
  return <UserContext.Provider value={expose}>{children}</UserContext.Provider>;
};

export const useUserData = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error("component must be used within a UserProvider");
  }
  return context;
};
