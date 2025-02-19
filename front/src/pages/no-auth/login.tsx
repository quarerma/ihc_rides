import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { post_no_auth } from "@/boot/axios";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/schema/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();
  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setLoginError("");
    try {
      const response = await post_no_auth("/auth/login", data);

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      setLoginError("Invalid email or password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-5 border-muted min-w-[400px] border-2 rounded-md flex flex-col space-y-5 items-center">
        <h1 className="text-3xl font-bold text-center">Welcome to rebU</h1>
        <img src="/logo.png" alt="logo" className="w-16 h-16" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-4"
        >
          <div className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="Enter your email"
              type="email"
              {...register("email")}
            />
            <p className="text-red-500 text-sm h-5">{errors.email?.message}</p>
          </div>
          <div className="w-full">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            <p className="text-red-500 text-sm h-5">
              {errors.password?.message}
            </p>
          </div>
          {loginError && (
            <p className="text-red-500 text-sm h-5">{loginError}</p>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Log in"}
          </Button>
        </form>
        <div className="flex justify-between w-full items-baseline">
          <span className="text-sm text-primary cursor-pointer">
            Forgot password?
          </span>
          <h1 className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-sm text-primary cursor-pointer">
              Sign up
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
}
