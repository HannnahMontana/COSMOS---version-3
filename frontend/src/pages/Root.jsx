import {
  Outlet,
  useLocation,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { useEffect, useContext } from "react";

import MainNavigation from "../components/layout/MainNavigation";
import Footer from "../components/layout/Footer";
import { getTokenDuration } from "../util/auth";
import { UserContext } from "../context/UserContext";

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
    console.log("root token menagement and user data fetching.");

    if (!token) {
      console.log("no token and no user");
      clearUser();
    }

    if (!token || user) {
      console.log("no token or user");
      console.log(user);
      return;
    }

    console.log("checking if token is expired");
    if (token === "EXPIRED") {
      console.log("token expired");
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log("token duration: ", tokenDuration);

    console.log("fetching user data...");
    // fetch user data
    fetchUser(token);

    // logout after token expiration
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit, user, fetchUser, clearUser]);

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
