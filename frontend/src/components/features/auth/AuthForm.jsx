import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";
import classes from "./AuthForm.module.css";

export default function AuthForm({ isLogin }) {
  const navigation = useNavigation();
  const data = useActionData();

  const isSubmitting = navigation.state === "submitting";

  const errorMessages = data && data.errors && (
    <ul className={classes.errorList}>
      {Object.values(data.errors).map((err) => (
        <li key={err}>{err}</li>
      ))}
    </ul>
  );

  return (
    <Form
      method="post"
      className={`d-flex flex-column align-items-end ${
        isLogin ? classes.loginForm : classes.registerForm
      }`}
    >
      <div className="row">
        <div className="col-md-3">
          <label>login</label>
        </div>
        <div className="col-md-9">
          <input
            className={`form-control ${classes.inputField}`}
            type="text"
            id="login"
            name="login"
            required
            minLength={3}
          />
        </div>
        <div className="col-md-3">
          <label>hasło</label>
        </div>
        <div className="col-md-9">
          <input
            className={`form-control ${classes.inputField}`}
            type="password"
            id="password"
            name="password"
            required
            minLength={6}
          />
          {isLogin && errorMessages}
        </div>
        {!isLogin && (
          <>
            <div className="col-md-4">
              <label>powtórz hasło</label>
            </div>
            <div className="col-md-8">
              <input
                className={`form-control ${classes.inputField}`}
                type="password"
                id="password2"
                name="password2"
                required
                minLength={6}
              />
              {errorMessages}
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-outline-light mt-3"
        disabled={isSubmitting}
      >
        {" "}
        {isSubmitting
          ? "Wysyłanie..."
          : isLogin
          ? "Zaloguj"
          : "Zarejestruj się"}
      </button>
    </Form>
  );
}
