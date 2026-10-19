import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { signInUser } from "@/redux/features/user/userThunk";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InputField from "@/components/global/InputField";
import PasswordInputField from "@/components/global/PasswordInputField";
import LoadingSpinner from "@/components/global/Loaders/LoadingSpinner";
import BackgroundImage from "../../../assets/background.png";
import Logo from "../../../assets/logo.png";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      // Dispatch the signInUser thunk
      await dispatch(signInUser(data)).unwrap();
      
      toast.success("Login successful!");
      
      // Navigate to dashboard after successful login
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(error || "Login failed");
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
          <h1 className="text-2xl font-bold text-textColor">Sign In</h1>
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

            <div className="flex flex-col">
              <PasswordInputField
                form={form}
                indicator={"password"}
                label={"Password"}
                placeholder={"********"}
              />
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full bg-primary hover:bg-gradient-primary-dark flex flex-row items-center justify-center"
              )}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;