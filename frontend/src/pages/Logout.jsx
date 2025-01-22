import { redirect } from "react-router-dom";

export function action() {
  console.log("logout action");
  console.log("Logging out...");

  localStorage.removeItem("token");
  localStorage.removeItem("expiration");

  console.log("Logged out.");
  console.log("Redirecting to /");
  return redirect("/");
}
