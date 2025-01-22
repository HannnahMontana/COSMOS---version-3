import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext.jsx";

import HomePage from "./pages/Home.jsx";
import AboutPage from "./pages/About.jsx";
import RootLayout from "./pages/Root.jsx";
import ArticlePage from "./pages/Article.jsx";
import AuthPage from "./pages/Auth.jsx";
import AddNewArticle from "./pages/AddNewArticle.jsx";
import EditEvent from "./pages/EditArticle.jsx";

import { action as authAction } from "./pages/Auth";
import { tokenLoader } from "./util/auth";
import { action as logoutAction } from "./pages/Logout";
import {
  loader as editEventLoader,
  action as editEventAction,
} from "./pages/EditArticle";

import { queryClient } from "./util/http";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import NotAuthorized from "./pages/NotAuthorized.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: tokenLoader,
    id: "root",
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      {
        path: "contact",
        element: <Navigate to="/about/#section-social-media" />,
      },
      {
        path: "articles",
        children: [
          {
            index: true,
            element: <Navigate to="/#section-articles" />,
          },
          {
            path: ":articleId",
            id: "article",
            children: [
              {
                index: true,
                element: <ArticlePage />,
              },
              {
                path: "edit",
                element: (
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                ),
                loader: editEventLoader,
                action: editEventAction,
              },
            ],
          },
          {
            path: "new",
            element: (
              <ProtectedRoute>
                <AddNewArticle />
              </ProtectedRoute>
            ),
          },
        ],
      },
      { path: "auth", element: <AuthPage />, action: authAction },
      { path: "logout", action: logoutAction },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
