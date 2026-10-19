/* eslint-disable react/prop-types */

import { Icons } from "@/lib/Icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

const PasswordInputField = ({ form, indicator, label, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField
      control={form.control}
      name={indicator}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...field}
              />
              {/* <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-5 p-0 bg-transparent hover:bg-transparent focus:ring-offset-0 focus:ring-0 focus:outline-none focus:border-none"
              >
                <img
                  src={showPassword ? Icons.passwordShow : Icons.passwordHide}
                  alt="password toggle"
                  className="w-7"
                />
              </Button> */}
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default PasswordInputField;
