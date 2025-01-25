import { createContext, useState } from "react";
import { fetchUserData } from "../util/http";

export const UserContext = createContext();

// tu bedzie zmiana is_admin - bedzie pobierac to z backendu

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData) => {
    console.log("Updating user data", userData);
    setUser(userData);
    setLoading(false);
  };

  const clearUser = () => {
    console.log("Clearing user data");
    setUser(null);
    setLoading(false);
  };

  const fetchUser = async (userId) => {
    setLoading(true);
    try {
      const userData = await fetchUserData(userId);
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
        isAdmin: user?.is_admin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
