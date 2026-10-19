import { Button } from "@/components/ui/button";
import { SidebarToggle } from "./SidebarToggle";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { Link } from "react-router-dom";
import { Menu } from "./Menu";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
// import Logo from "../../../assets/Logos/primaryLogo.png";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 border left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 border-none bg-[#181818] dark:bg-[#1A1A1A] text-white",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <div className="relative h-full flex flex-col px-3 shadow-md">
        <div className="flex flex-row items-center justify-center">
          <Button
            className={cn(
              "transition-transform ease-in-out duration-300 mb-1 p-0",
              sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
              sidebar?.isOpen === true ? "w-36 h-36" : "w-14 h-14"
            )}
            variant="link"
            asChild
          >
            {/* <img src={Logo} alt="Logo" className="w-full h-full" /> */}
          </Button>
        </div>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
