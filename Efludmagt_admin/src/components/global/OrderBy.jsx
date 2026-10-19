/* eslint-disable react/prop-types */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const OrderBy = ({ value, onChange, options }) => {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="w-[150px] text-start p-0 border-none bg-transparent outline-none focus:ring-0 focus:ring-offset-0 text-sm flex flex-row items-center gap-1">
        <p className="text-textColor font-semibold">Order:</p>
        <SelectValue placeholder="latest" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrderBy;
