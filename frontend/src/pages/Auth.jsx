import { redirect, Link, useSearchParams } from "react-router-dom";

import AuthForm from "../components/features/auth/AuthForm";
import AnimationFollowingImage from "../components/features/animations/AnimationFollowImage";
import classes from "./Auth.module.css";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  return (
    <div className={`container ${classes.auth}`}>
      <AnimationFollowingImage
        imgUrl="/round-abstract-electric.png"
        imgSize={550}
      />

      <div className={isLogin ? classes.loginPanel : classes.registerPanel}>
        <h1>{isLogin ? "Zaloguj się" : "Zarejestruj się"}</h1>

        <AuthForm isLogin={isLogin} />
      </div>

      <div className={classes.linkAuth}>
        {isLogin ? "Nie masz konta? " : "Masz już konto? "}
        <Link
          to={`?mode=${isLogin ? "signup" : "login"}`}
          className={classes.underlined}
        >
          {isLogin ? "Zarejestruj się!" : "Zaloguj się!"}
        </Link>
      </div>
    </div>
  );
}

export async function action({ request }) {
  console.log("auth action");

  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw new Response(JSON.stringify({ message: "Unsupported mode." }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await request.formData();
  const authData = {
    username: data.get("login"),
    password: data.get("password"),
    password2: data.get("password2"),
  };
  console.log(authData);

  // sign up password confirmation
  if (mode === "signup" && authData.password !== authData.password2) {
    console.log("passwords do not match");
    return {
      errors: [
        {
          code: "passwords-not-match",
          description: "Hasła muszą być identyczne.",
        },
      ],
    };
  }

  delete authData.password2;

  const response = await fetch("http://localhost:8080/Auth/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
    credentials: "include",
  });

  console.log("response: ", response);
  console.log("response erros: ", response?.errors);

  if (response.status === 400 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Could not authenticate user." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return redirect("/");
}
