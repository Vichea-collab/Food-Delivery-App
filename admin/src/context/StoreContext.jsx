import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const url = "http://localhost:4000";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin") === "true";
    const storedUserId = localStorage.getItem("userId");

    if (savedToken) setToken(savedToken);
    if (isAdmin) setAdmin(true);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    userId,
    setUserId,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
