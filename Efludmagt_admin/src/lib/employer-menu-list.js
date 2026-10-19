import { Icons } from "./Icons";

export function getMenuList(pathname) {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/employer/dashboard",
          label: "Dashboard",
          active: pathname.includes("/employer/dashboard"),
          icon: Icons.dashboard,
          activeIcon: Icons.dasboadActive,
          submenus: [],
        },
        {
          href: "/employer/check-Ins",
          label: "Check-Ins",
          active: pathname.includes("/employer/check-Ins"),
          icon: Icons.checkIns,
          activeIcon: Icons.checkInsActive,
          submenus: [],
        },
        {
          href: "/employer/users",
          label: "Users",
          active: pathname.includes("/employer/users"),
          icon: Icons.users,
          activeIcon: Icons.usersActive,
          submenus: [],
        },
        {
          href: "/employer/approvals",
          label: "Approvals",
          active: pathname.includes("/employer/approvals"),
          icon: Icons.approvals,
          activeIcon: Icons.approvalsActive,
          submenus: [],
        },
        {
          href: "/employer/settings",
          label: "Settings",
          active: pathname.includes("/employer/settings"),
          icon: Icons.settings,
          activeIcon: Icons.settingsActive,
          submenus: [],
        },
      ],
    },
  ];
}
