import BackgroundImage from "../../../assets/backgrounds/LoginBg.png";
import Logo from "../../../assets/Logos/primaryLogo.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import PasswordInputField from "@/components/global/PasswordInputField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword } from "@/utils/functions/authFunctions";
import { useState } from "react";
import LoadingSpinner from "@/components/global/Loaders/LoadingSpinner";

const formSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  const [searchParams] = useSearchParams();
  const resetCode = searchParams.get("oobCode");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    if (!resetCode) {
      toast.error("Invalid reset code");
      return;
    }

    try {
      setLoading(true);
      await changePassword(resetCode, values.newPassword);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-row items-centers justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="w-full sm:w-96 px-5 sm:px-0 flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-36" />
        <div className="w-full">
          <h1 className="text-2xl font-bold text-textColor">
            Create New Password
          </h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 w-full mt-5"
          >
            <PasswordInputField
              form={form}
              indicator={"newPassword"}
              label={"New Password"}
              placeholder={"********"}
            />

            <PasswordInputField
              form={form}
              indicator={"confirmPassword"}
              label={"Confirm Password"}
              placeholder={"********"}
            />

            <div className="w-full pt-5">
              <Button
                type="submit"
                className={cn(
                  "w-full bg-gradient-primary hover:bg-gradient-primary-dark"
                )}
                loading={loading}
              >
                {loading ? <LoadingSpinner /> : "Finish & Login"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
