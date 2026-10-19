import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function UserNav() {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="flex flex-row items-center gap-2">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Link to="settings" className="relative h-12 w-12 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profilePicture} alt="Avatar" />
                <AvatarFallback className="bg-transparent">JD</AvatarFallback>
              </Avatar>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex flex-col">
        <p className="text-md font-semibold">{user?.name}</p>
        <p className="text-xs font-light">Admin</p>
      </div>
    </div>
  );
}
