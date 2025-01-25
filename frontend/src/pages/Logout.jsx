import { redirect } from "react-router-dom";
import { logout } from "../util/http";

export async function action() {
  console.log("logout action");
  console.log("Logging out...");

  try {
    const success = await logout();

    if (!success) {
      throw new Error("Error logging out.");
    }

    console.log("Logged out.");
    console.log("Redirecting to /");

    return redirect("/");
  } catch (error) {
    console.error("Error logging out:", error);
    return redirect("/");
  }
}
