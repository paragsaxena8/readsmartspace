import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import { Blog } from "../../dashboard/Blog";
import { Reviews } from "../../dashboard/Reviews";
import { Journal } from "../../dashboard/Journal";
import { Dashboard } from "../../dashboard/dashboard";
import { MainLayout } from "../layout";
import { CreateBlog } from "../../dashboard/Blog/create-blog";
import { CreateReview } from "../../dashboard/Reviews/create-review";
import { CreateJournal } from "../../dashboard/Journal/create-journal";
import { Auth } from "../../pages/Auth/Auth";
import { AuthProvider } from "../../../utils/context/AuthContext";
import { ThemeProvider } from "../../../utils/context/ThemeContext";
import { ActivateAccount } from "../../pages/Auth/Activate-Account";
import { Settings } from "../../dashboard/Settings";

function ProtectedRoute(props: any) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Redirecting to /auth");
    return <Navigate to="/auth" />;
  }

  return props.children;
}

export const routesArray: RouteObject[] = [
  {
    id: "Dashboard",
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    id: "My Blogs",
    children: [
      {
        id: "All Blogs",
        path: "/blogs",
        element: <Blog />,
      },
      {
        id: "Create Blog",
        path: "/create-blog",
        element: <CreateBlog />,
      },
    ],
  },
  {
    id: "My Reviews",
    children: [
      {
        id: "All Reviews",
        path: "/reviews",
        element: <Reviews />,
      },
      {
        id: "Create Review",
        path: "/create-review",
        element: <CreateReview />,
      },
    ],
  },
  {
    id: "My Journal",
    children: [
      {
        id: "Journals",
        path: "/journal",
        element: <Journal />,
      },
      {
        id: "Add Journal Entry",
        path: "/create-journal",
        element: <CreateJournal />,
      },
    ],
  },
  {
    id: "Settings",
    path: "/settings",
    element: <Settings />,
  },
];

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/auth",
    element: (
      <AuthProvider>
        <Auth />
      </AuthProvider>
    ),
  },
  {
    path: "/activate",
    element: <ActivateAccount />,
  },
  {
    id: "home",
    path: "/",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <ThemeProvider>
            <MainLayout />
          </ThemeProvider>
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: routesArray,
  },
]);
