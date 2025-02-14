import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, SignupData } from "@/schema/signup.schema";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cpfValid, setCpfValid] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const allFieldsFilledStep1 =
    watch("first_name") &&
    watch("last_name") &&
    watch("birth_date") &&
    watch("cpf");

  const allFieldsFilledStep2 =
    watch("email") && watch("password") && watch("confirm_password");

  const handleCPFValidation = async () => {
    setLoading(true);
    try {
      const cpf = watch("cpf");
      const response = await axios.get(`/api/validate-cpf?cpf=${cpf}`);

      if (response.status === 200) {
        setCpfValid(true);
        setStep(2);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setCpfError("Invalid or already in use CPF");
        setCpfValid(false);
      } else {
        setCpfError("Validation error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignupData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/login");
    } catch (error) {
      console.error("Sign-up failed", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

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
    setCpfError(isValidCPF(formattedCPF) ? null : "Invalid CPF");
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
    setValue("birth_date", formattedDate, { shouldValidate: true });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-5 border-muted min-w-[500px] border-2 rounded-md flex flex-col space-y-5 items-center">
        <h1 className="text-3xl font-bold text-center">Sign Up to rebU</h1>
        <img src="/logo.png" alt="logo" className="w-16 h-16" />
        {step === 1 ? (
          <div className="w-full flex flex-col space-y-3">
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
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input
              value={birthDate}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              onChange={handleDateChange}
            />
            <p className="text-red-500 text-sm h-5">
              {errors.birth_date?.message}
            </p>
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
            <Button
              onClick={handleCPFValidation}
              disabled={!allFieldsFilledStep1 || loading}
            >
              Next
            </Button>
            <Button variant="link" onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </div>
        ) : (
          <form
            className="w-full flex flex-col space-y-3"
            onSubmit={handleSubmit(handleSignUp)}
          >
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} placeholder="Enter your email" />
            <p className="text-red-500 text-sm h-5">{errors.email?.message}</p>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
            />
            <p className="text-red-500 text-sm h-5">
              {errors.password?.message}
            </p>
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              type="password"
              {...register("confirm_password")}
              placeholder="Confirm your password"
            />
            <p className="text-red-500 text-sm h-5">
              {errors.confirm_password?.message}
            </p>
            <Button type="submit" disabled={!allFieldsFilledStep2 || loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <Button variant="link" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="link" onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
