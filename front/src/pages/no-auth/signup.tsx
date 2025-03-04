import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get_no_auth, post_no_auth } from "@/boot/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, SignupData } from "@/schema/signup.schema";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cpfValid, setCpfValid] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [step, setStep] = useState(2);
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
    watch("user_firstname") &&
    watch("user_lastname") &&
    watch("birth_date") &&
    watch("cpf");

  const allFieldsFilledStep2 =
    watch("email") && watch("password") && watch("confirm_password");

  const handleCPFValidation = async () => {
    setLoading(true);
    try {
      const cpf = watch("cpf");
      const params = new URLSearchParams();
      params.append("cpf", cpf.toString());
      const response = await get_no_auth("/auth/validate-cpf", { params });

      console.log(response);
      if (response.status === 200) {
        setCpfValid(true);
        setStep(2);
        setCpfError(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
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
      data.birth_date = convertToISO(data.birth_date);
      await post_no_auth("/users", data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setEmailError("Email already in use");
      } else console.error("Sign-up failed", error);
    } finally {
      setLoading(false);
    }
  };

  function convertToISO(dateStr: string) {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day)); // Month is 0-based
    return date.toISOString();
  }

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
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="p-5 border-border md:min-w-[500px] max-md:w-full max-md:mx-5 my-10 border-2 bg-white rounded-md flex flex-col space-y-5 items-center">
        <h1 className="text-3xl font-bold text-center">Cadastre-se no rebU</h1>
        <img src="/logo.png" alt="logo" className="w-16 h-16" />
        {step === 1 ? (
          <div className="w-full flex flex-col space-y-3">
           
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  {...register("user_firstname")}
                  placeholder="Digite seu nome"
                />
                <p className="text-red-500 text-sm h-5">
                  {errors.user_firstname?.message}
                </p>
           
           
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  {...register("user_lastname")}
                  placeholder="Digite seu sobrenome"
                />
                <p className="text-red-500 text-sm h-5">
                  {errors.user_lastname?.message}
                </p>
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <Input
              value={birthDate}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <p className="text-red-500 text-sm h-5">
              {errors.birth_date?.message}
            </p>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              {...register("cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <p className="text-red-500 text-sm h-5">
              {cpfError || errors.cpf?.message}
            </p>
            <Button
              onClick={() => setStep(2)}
              disabled={!allFieldsFilledStep1 || loading}
            >
              Próximo
            </Button>
            <Button variant="link" onClick={() => navigate("/login")}>
              Voltar para o Login
            </Button>
          </div>
        ) : (
          <form
            className="w-full flex flex-col space-y-3"
            onSubmit={handleSubmit(() => navigate("/login"))}
          >
            <Label htmlFor="email">E-mail</Label>
            <Input {...register("email")} placeholder="Digite seu e-mail" />
            <p className="text-red-500 text-sm h-5">
              {errors.email?.message || emailError}
            </p>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Digite sua senha"
            />
            <p className="text-red-500 text-sm h-5">
              {errors.password?.message}
            </p>
            <Label htmlFor="confirm_password">Confirme sua Senha</Label>
            <Input
              type="password"
              {...register("confirm_password")}
              placeholder="Confirme sua senha"
            />
            <p className="text-red-500 text-sm h-5">
              {errors.confirm_password?.message}
            </p>
            <Button type="submit" disabled={!allFieldsFilledStep2 || loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
            <Button variant="link" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button variant="link" onClick={() => navigate("/login")}>
              Voltar para o Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
