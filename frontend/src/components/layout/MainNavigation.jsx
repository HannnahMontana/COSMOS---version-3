import { useContext } from "react";
import { NavLink, useRouteLoaderData, Form } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { UserContext } from "../../context/UserContext";

export default function MainNavigation() {
  const token = useRouteLoaderData("root");
  const { isAdmin } = useContext(UserContext);

  console.log("MainNavigation admin", isAdmin);

  return (
    <header>
      <nav
        className={`navbar navbar-expand-lg navbar-dark ${classes.mainNavbar}`}
      >
        <NavLink className={`navbar-brand ${classes.mainNavbarBrand}`} to="/">
          COSMOS
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto">
            <li className={`nav-item ${classes.mainNavItem}`}>
              <NavLink
                className={`nav-link ${classes.mainNavLink} ${({ isActive }) =>
                  isActive ? classes.active : undefined}}`}
                to="/articles"
              >
                Odkryj
              </NavLink>
            </li>
            <li className={`nav-item ${classes.mainNavItem}`}>
              <NavLink
                className={`nav-link ${classes.mainNavLink} ${({ isActive }) =>
                  isActive ? classes.active : undefined}}`}
                to="/about"
              >
                O Nas
              </NavLink>
            </li>
            <li className={`nav-item ${classes.mainNavItem}`}>
              <NavLink
                className={`nav-link ${classes.mainNavLink} ${({ isActive }) =>
                  isActive ? classes.active : undefined}}`}
                to="/contact"
              >
                Kontakt
              </NavLink>
            </li>
            {isAdmin && token && (
              <li className={`nav-item ${classes.mainNavItem}`}>
                <NavLink
                  className={`nav-link ${classes.mainNavLink} ${({
                    isActive,
                  }) => (isActive ? classes.active : undefined)}}`}
                  to="/articles/new"
                >
                  Dodaj artykuł
                </NavLink>
              </li>
            )}
            {!token && (
              <li className={`nav-item ${classes.mainNavItem}`}>
                <NavLink
                  className={`nav-link ${classes.mainNavLink} ${({
                    isActive,
                  }) => (isActive ? classes.active : undefined)}}`}
                  to="/auth?mode=login"
                >
                  Zaloguj się
                </NavLink>
              </li>
            )}
            {token && (
              <li className={`nav-item ${classes.mainNavItem}`}>
                <Form action="/logout" method="post">
                  <button className={`nav-link ${classes.navLinkBtn}`}>
                    Wyloguj się
                  </button>
                </Form>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
