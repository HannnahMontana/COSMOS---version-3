import {
  Outlet,
  useLocation,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { useEffect, useContext } from "react";

import MainNavigation from "../components/layout/MainNavigation";
import Footer from "../components/layout/Footer";
import { UserContext } from "../context/UserContext";
import { fetchSession } from "../util/http";

function RootLayout() {
  const { hash, pathname } = useLocation();
  const { user, fetchUser, clearUser } = useContext(UserContext);

  const token = useLoaderData();
  const submit = useSubmit();

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

    if (!user) {
      fetchSession(fetchUser, clearUser);
    }
  }, [user, fetchUser, clearUser]);

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
