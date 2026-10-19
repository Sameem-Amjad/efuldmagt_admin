/* eslint-disable react/prop-types */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Input } from "../ui/input";

const PhoneNumberField = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name={"phoneNumber"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{"Phone Number"}</FormLabel>
          <FormControl>
            {/* <PhoneInput
              containerClass="w-full"
              inputStyle={{
                width: "100%",
                height: "2.5rem",
                padding: "0.5rem",
                paddingLeft: "45px",
                fontSize: "0.8rem",
                borderRadius: "0.5rem",
                border: "2px solid rgba(0, 0, 0, 0.1)",
              }}
              inputProps={{
                name: "phoneNumber",
                required: true,
                autoFocus: false,
                placeholder: "Enter phone number",
              }}
              value={form.watch("phoneNumber")}
              onChange={(value) => {
                form.setValue("phoneNumber", value);
              }}
              {...field}
            /> */}

            <div className="flex flex-row text-textColor text-sm gap-2">
              <div className="p-1 border rounded-md flex items-center justify-center">
                +44
              </div>
              <Input
                type={"number"}
                value={form.watch("phoneNumber")}
                onChange={(value) => {
                  form.setValue("phoneNumber", value);
                }}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default PhoneNumberField;
