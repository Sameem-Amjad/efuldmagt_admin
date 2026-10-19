import { getGreetingWithEmoji } from "@/utils/functions/getGreetingWithEmoji";
import { SheetMenu } from "./SheetMenu";
import { UserNav } from "./UserNav";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Create a media query that matches screens >= 640px
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const handleMediaQueryChange = (e) => {
      setIsVisible(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    setIsVisible(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md">
      <div className="mx-4 sm:mx-8 flex py-2 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold sm:text-2xl text-textColor">
              Admin Panel
            </h1>
            <span className={`text-sm ${isVisible ? "block" : "hidden"}`}>
              Hey {user?.name}! {getGreetingWithEmoji()}
            </span>
          </div>
        </div>
     
      </div>
    </header>
  );
}
