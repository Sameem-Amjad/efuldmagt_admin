import PageLoader from "@/components/global/Loaders/PageLoader";
import { Components } from "@/utils/componentImport";
import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom"; // Import Navigate
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    // 1. Redirect the root path to /admin. The ProtectedRoute will handle the rest.
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <Components.AdminMainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        // 2. Set the dashboard as the default index route for /admin
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Dashboard />
          </Suspense>
        ),
      },
      {
        path: "fuldmagts",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Efuldmagts />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Users />
          </Suspense>
        ),
      },
      {
        path: "EfuldmagtForm",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.EfuldmagtForm />
          </Suspense>
        ),
      },
      {
        path: "CreateUserOrCompany",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CreateUserOrCompany />
          </Suspense>
        ),
      },
      {
        path:"reviewFludgments",
        element:(
          <Suspense fallback={<PageLoader />}>
            <Components.ReviewFludgment />
          </Suspense>
        ),
      },
          {path:"editfludgment/:id",
            element:(
              <Suspense fallback={<PageLoader />}>
                <Components.EditFuldgment />
              </Suspense>
            )
          },
      {
        path: "EfuldmagtForm/create-fuldmagt",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CreateForm />
          </Suspense>
        ),
      },
      {
        path: "CreateUserOrCompany/create-private-user",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CreatePrivateUser />
          </Suspense>
        ),
      },
      {
        path: "CreateUserOrCompany/create-company-user",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CreateCompany />
          </Suspense>
        ),
      },
      {
        path: "users/edit-user/:userId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Edituser />
          </Suspense>
        )
      },
      {
        path: "companies/edit-companie/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.EditCompany />
          </Suspense>
        )
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Suspense fallback={<PageLoader />}>
          <Components.Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Components.PageNotFound />
      </Suspense>
    ),
  },
  // The old "/" route is no longer needed as it's handled by the redirect above.
  // The commented-out routes can be added back in the same way.
]);
