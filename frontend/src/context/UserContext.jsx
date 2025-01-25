import { createContext, useState } from "react";
import { fetchUserData } from "../util/http";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData) => {
    console.log("Updating user data", userData);
    console.log("User roles", userData?.roles);
    setUser(userData);
    setLoading(false);
  };

  const clearUser = () => {
    console.log("Clearing user data");
    setUser(null);
    setLoading(false);
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await fetchUserData();
      updateUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        loading,
        fetchUser,
        isAdmin: user?.roles.includes("Admin"),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
