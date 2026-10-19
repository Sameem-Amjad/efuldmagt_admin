/* eslint-disable react/prop-types */

import { Icons } from "@/lib/Icons";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { generatePassword } from "@/utils/functions/generatePassword";

const PasswordGenerateField = ({
  form,
  indicator,
  label,
  placeholder,
  type = "text",
  disabled = false,
}) => {
  const generateRandomPassword = () => {
    const password = generatePassword();

    form.setValue(indicator, password);
  };

  return (
    <FormField
      control={form.control}
      name={indicator}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50">
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                disabled={disabled}
                className="px-0 py-0 h-auto border-none ring-0 focus:ring-0 focus:border-0 focus:outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none"
              />
              <Button
                onClick={generateRandomPassword}
                type="button"
                className="rounded-full bg-[#48525B] text-white flex flex-row items-center gap-2 px-4 h-auto"
              >
                <p className="text-xs md:text-sm">Generate</p>
                <img src={Icons?.generate} alt="" className="h-4 w-4" />
              </Button>
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default PasswordGenerateField;
