import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, SignupData } from "@/schema/signup.schema";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [birth_date, setBirthDate] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    console.log(watch());
  }, [watch]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, ""); // Remove non-digit characters

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Invalid if not 11 digits or all digits are the same

    const calculateDigit = (slice: string, factor: number) => {
      let sum = 0;
      for (let i = 0; i < slice.length; i++) {
        sum += parseInt(slice[i]) * (factor - i);
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
    const secondDigit = calculateDigit(cpf.slice(0, 10), 11);

    return firstDigit === parseInt(cpf[9]) && secondDigit === parseInt(cpf[10]);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setValue("cpf", formattedCPF, { shouldValidate: true });

    if (!isValidCPF(formattedCPF)) {
      setCpfError("Invalid CPF");
    } else {
      setCpfError(null);
    }
  };

  const formatDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 10);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDate(e.target.value);
    setBirthDate(formattedDate);

    const parsedDate = new Date(
      formattedDate.split("/").reverse().join("-")
    ).toISOString();
    setValue("birth_date", parsedDate, { shouldValidate: true });
  };

  const handleSignUp = async (data: SignupData) => {
    setLoading(true);
    try {
      if (!isValidCPF(data.cpf)) {
        setCpfError("Invalid CPF");
        setLoading(false);
        return;
      }

      console.log("Signing up with", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/login");
    } catch (error) {
      console.error("Sign-up failed", error);
    } finally {
      setLoading(false);
    }
  };

  const allFieldsFilled =
    watch("first_name") &&
    watch("last_name") &&
    watch("birth_date") &&
    watch("cpf") &&
    watch("email") &&
    watch("password") &&
    watch("confirm_password") &&
    !cpfError;

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-5 border-muted min-w-[500px] border-2 rounded-md flex flex-col space-y-5 items-center">
        <h1 className="text-3xl font-bold text-center">Sign Up to rebU</h1>
        <img src="/logo.png" alt="logo" className="w-16 h-16" />
        <form
          className="w-full flex flex-col space-y-3"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <div className="w-full flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                {...register("first_name")}
                placeholder="Enter your first name"
              />
              <p className="text-red-500 text-sm h-5">
                {errors.first_name?.message}
              </p>
            </div>
            <div className="flex-1">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                {...register("last_name")}
                placeholder="Enter your last name"
              />
              <p className="text-red-500 text-sm h-5">
                {errors.last_name?.message}
              </p>
            </div>
          </div>

          <div className="w-full">
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input
              value={birth_date}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              onChange={handleDateChange}
            />
            <p className="text-red-500 text-sm h-5">
              {errors.birth_date?.message}
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              {...register("cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={handleCPFChange}
            />
            <p className="text-red-500 text-sm h-5">
              {cpfError || errors.cpf?.message}
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} placeholder="Enter your email" />
            <p className="text-red-500 text-sm h-5">{errors.email?.message}</p>
          </div>

          <div className="w-full">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
            />
            <p className="text-red-500 text-sm h-5">
              {errors.password?.message}
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              type="password"
              {...register("confirm_password")}
              placeholder="Confirm your password"
            />
            <p className="text-red-500 text-sm h-5">
              {errors.confirm_password?.message}
            </p>
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={!allFieldsFilled || loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <div className="flex justify-between w-full items-baseline">
          <h1 className="text-sm">
            Already have an account?
            <span
              className="text-sm text-primary cursor-pointer"
              onClick={() => navigate("/login")}
            >
              {" "}
              Log in
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
