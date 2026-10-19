/* eslint-disable react/prop-types */

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const InputField = ({
  form,
  indicator,
  label,
  placeholder,
  type = "text",
  disabled = false,
}) => {
  return (
    <FormField
      control={form.control}
      name={indicator}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default InputField;
