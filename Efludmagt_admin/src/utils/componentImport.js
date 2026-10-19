import React, { lazy } from "react";

export const Components = {
  AdminMainLayout: React.lazy(() => import("@/layouts/AdminMainLayout")),

  Dashboard: lazy(() => import("@/pages/admin/Main_Dashboard")),
  Efuldmagts: lazy(() => import("@/pages/admin/Efuldmagts")),
  Users: lazy(() => import("@/pages/admin/Users")),
  EfuldmagtForm: lazy(() => import("@/pages/admin/EfuldmagtForm")),
  CreateUserOrCompany: lazy(() => import("@/pages/admin/CreateUser_Company")),
  CreateForm: lazy(() =>
    import("@/pages/admin/EfuldmagtForm/components/create_e_fuldmagt")
  ),
  CreatePrivateUser: lazy(() =>
    import("@/pages/admin/CreateUser_Company/components/create_user")
  ),
  CreateCompany: lazy(() =>
    import("@/pages/admin/CreateUser_Company/components/create-company")
  ),
  Edituser: lazy(() => import("@/pages/admin/Users/components/edit_user")),
  EditCompany: lazy(() =>
    import("@/pages/admin/Users/components/edit-company")
  ),
  PageNotFound: lazy(() => import("@/pages/PageNotFound")),

  // ChangePassword: React.lazy(() => import("@/Pages/Auth/ChangePassword")),
  // ForgotPassword: React.lazy(() => import("@/Pages/Auth/ForgotPassword")),
  Login: React.lazy(() => import("@/pages/Auth/Login")),
  ReviewFludgment:lazy(()=>import("@/pages/admin/review_fludgments/index")),
  EditFuldgment:lazy(()=>import("@/pages/admin/Edit_Fludgments/index"))
  // PageNotFound: React.lazy(() => import("@/Pages/PageNotFound")),
};
