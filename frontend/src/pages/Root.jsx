import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";

import MainNavigation from "../components/layout/MainNavigation";
import Footer from "../components/layout/Footer";
import { UserContext } from "../context/UserContext";
import { fetchSession } from "../util/http";

function RootLayout() {
  const { hash, pathname } = useLocation();
  const { user, fetchUser, clearUser } = useContext(UserContext);
  const location = useLocation();

  // scrolling to element with id from hash
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  // token menagement and user data fetching
  useEffect(() => {
    console.log("root user data fetching.");

    const initializeUserSession = async () => {
      console.log("Initializing user session...");
      const sessionActive = await fetchSession();

      console.log("Session active:", sessionActive);

      if (sessionActive) {
        console.log("Session is active, fetching user data...");
        fetchUser();
      } else {
        console.log("No active session, clearing user...");
        clearUser();
      }
    };

    if (!user) {
      console.log("No user data, initializing user session...");
      initializeUserSession();
    }
  }, [user, fetchUser, clearUser, location.pathname]);

  const showFooter = !pathname.startsWith("/auth");

  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </>
  );
}

export default RootLayout;
