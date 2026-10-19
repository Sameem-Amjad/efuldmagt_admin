import { cn } from "@/lib/utils";
import { Sidebar } from "./components/Sidebar";
import { useStore } from "@/hooks/useStore";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster"

const AdminMainLayout = () => {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-screen bg-white dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 flex flex-col flex-1",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Navbar />
        <Outlet />
        <Toaster />

      </main>
    </>
  );
};

export default AdminMainLayout;
