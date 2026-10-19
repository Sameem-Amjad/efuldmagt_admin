import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-black text-8xl font-bold">404</h1>
      <p className="font-light text-lg">OOPs ! Page Not Found</p>
      <Link to="/">
        <Button className="bg-primary text-white">
          Back to Login Page</Button>
      </Link>
    </div>
  );
};

export default PageNotFound;
