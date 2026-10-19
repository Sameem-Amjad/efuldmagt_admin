import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "./Menu";
// import Logo from "../../../assets/Logos/primaryLogo.png";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={25} />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        className="sm:w-72 px-3 h-full flex flex-col"
        side="left"
      >
        <SheetTitle></SheetTitle>
        <SheetHeader
          className={" w-full flex flex-row items-center justify-center"}
        >
          <Button className={"mb-1 p-0 w-40 h-40"} variant="link" asChild>
            {/* <img src={Logo} alt="Logo" className="w-full h-full" /> */}
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
