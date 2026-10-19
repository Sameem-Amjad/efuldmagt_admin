import BackgroundImage from "../../../assets/backgrounds/LoginBg.png";
import Logo from "../../../assets/Logos/primaryLogo.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import InputField from "@/components/global/InputField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { useState } from "react";
import LoadingSpinner from "@/components/global/Loaders/LoadingSpinner";
import { auth } from "../../../../firebase.js";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email(),
});

const initialValues = {
  email: "",
};

const ForgotPassword = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, values.email);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      console.log(error);

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
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-2xl font-bold text-textColor">Forget Password</h1>
          <p className="text-sm text-textColor">
            Write email associated with your account. A link will be sent to
            that email.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 w-full mt-5"
          >
            <InputField
              form={form}
              indicator={"email"}
              label={"Email Address"}
              placeholder={"abc@gmail.com"}
            />

            <div className="w-full pt-5">
              <Button
                type="submit"
                className={cn(
                  "w-full bg-gradient-primary hover:bg-gradient-primary-dark"
                )}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : "Get Link"}
              </Button>
            </div>
          </form>
          <Button
            onClick={() => navigate("/login")}
            className="mt-2"
            variant="link"
            type="button"
          >
            Back to Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
