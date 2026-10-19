/* eslint-disable react/prop-types */
import { Icons } from "@/lib/Icons";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const SearchField = ({ placeholder, value, onChange, isRounded = true }) => {
  return (
    <div className="w-full relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn("pl-10", isRounded ? "rounded-full" : "rounded-lg")}
      />
      <img
        src={Icons.search}
        alt="search user"
        className=" w-5 absolute top-1/2 -translate-y-1/2 left-3"
      />
    </div>
  );
};

export default SearchField;
