import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-5 border-muted min-w-[400px] border-2 rounded-md flex flex-col space-y-5 items-center ">
        <h1 className="text-3xl font-bold text-center">Welcome to rebU</h1>
        <img src="/logo.png" alt="logo" className="w-16 h-16" />
        <div className="w-full">
          <Label htmlFor="email">Email</Label>
          <Input placeholder="Enter your email" />
        </div>
        <div className="w-full">
          <Label htmlFor="password">Password</Label>
          <Input type="password" placeholder="Enter your password" />
        </div>
        <Button className="w-full"> Log in</Button>
        <div className="flex justify-between w-full items-baseline">
          <span className="text-sm text-primary cursor-pointer">
            Forgot password?
          </span>
          <h1 className="text-sm">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-sm text-primary cursor-pointer "
            >
              Sign up
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
}
