import { Icons } from "./Icons";
export function getMenuList(pathname) {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          active: pathname === "/admin",
          icon: Icons.dashboard,
          activeIcon: Icons.dasboadActive,
          submenus: [],
        },
        {
          href: "/admin/fuldmagts",
          label:"Used E-Fuldmagts",
          active: pathname.includes("/admin/fuldmagts"),
          icon: Icons.mail,
          activeIcon: Icons.usersActive,
          submenus: [],
        },
        {
          href: "/admin/users",
          label: "All users",
          active: pathname.includes("/admin/users"),
          icon: Icons.user,
          activeIcon: Icons.user,
          submenus: [],
        },
        {
          href:"/admin/reviewFludgments",
          label: "All E-Fuldmagts",
          active: pathname.includes("/admin/reviewFludgments"),
          icon: Icons.mail,
          activeIcon: Icons.review,
          submenus: [],

        },
        {
          href: "/admin/EfuldmagtForm",
          label: "Create E-Fuldmagt Form",
          active: pathname.includes("/admin/EfuldmagtForm"),
          icon: Icons.create,
          activeIcon: Icons.create,
          submenus: [],
        },
        {
          href: "/admin/CreateUserOrCompany",
          label: "Create user/company",
          active: pathname.includes("/admin/CreateUserOrCompany"),
          icon: Icons.new_user,
          activeIcon: Icons.new_user,
          submenus: [],
        },
      ],
    },
  ];
}
