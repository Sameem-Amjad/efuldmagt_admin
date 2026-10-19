/* eslint-disable react/prop-types */
import { Ellipsis, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { CollapseMenuButton } from "./CollapseMenuButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icons } from "@/lib/Icons";
import { getMenuList } from "@/lib/admin-menu-list";
import { auth } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/features/user/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Menu({ isOpen }) {
  const [menuList, setMenuList] = useState([]);
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("Menu List", menuList);
  useEffect(() => {
    const list = getMenuList(pathname);

    setMenuList(list);
  }, [pathname]);

  const { user } = useSelector((state) => state.user);
  const adminName = user?.name || "Admin";
  const initials = adminName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    dispatch(clearUser());
    navigate(0);
     
  };

  return (
    <nav className="my-2 w-full flex flex-1 overflow-hidden">
      <ul className="flex flex-col px-2 flex-1">
        <ScrollArea className="flex grow w-full">
          <div className="flex flex-col items-center justify-center w-full h-20 mb-12 mt-12 mb-12">
            {/* The signed-in admin (this used to be a placeholder name and stock photo) */}
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-[#3cb4e4] text-white text-xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-center flex-col ml-4 mt-4">
              <p className="text-lg font-semibold">{adminName}</p>
              <p className="text-xs font-light text-[#7F7F7F]">Logged in as Admin</p>
            </div>
          </div>
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon, activeIcon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={active ? "w-full bg-black justify-start h-12 mb-2 rounded-lg hover:bg-black" : "w-full justify-start h-12 mb-2 rounded-lg hover:bg-black"}
                              asChild
                            >
                              <Link to={href}>
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex items-center">
                                    <span
                                      className={cn(
                                        "w-6",
                                        isOpen === false ? "" : "mr-4"
                                      )}
                                    >
                                      <img
                                        src={active ? icon : icon}
                                        alt={label}
                                        className="w-5 h-5"
                                      />
                                    </span>
                                    <p
                                      className={cn(
                                        "max-w-[200px] truncate text-sm",
                                        isOpen === false
                                          ? "-translate-x-56 opacity-0"
                                          : "translate-x-0 opacity-100",
                                        active ? "text-white" : "text-white"
                                      )}
                                    >
                                      {label}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    {active && <div className="h-5 w-1 bg-[#3CB4E4] rounded-full ml-2"></div>}
                                  </div>
                                </div>

                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
        </ScrollArea>
        <li className="w-full grow flex items-end">
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className={cn(
                    "justify-start h-12 mb-2 rounded-lg mt-10 transition-colors duration-200 ease-in-out text-[#F10A0A] hover:text-white hover:bg-[#F10A0A] dark:hover:bg-[#F10A0A] dark:text-white",
                    isOpen === false ? "" : "w-full"
                  )}
                >
                  <LogOut className="h-6 w-6 mr-4" />
                  Log out
                  {isOpen === false && (
                    <TooltipContent side="right">Sign out</TooltipContent>
                  )}
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
}
