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

  // session menagement and user data fetching
  useEffect(() => {
    const initializeUserSession = async () => {
      const sessionActive = await fetchSession();

      if (sessionActive) {
        fetchUser();
      } else {
        clearUser();
      }
    };

    if (!user) {
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
