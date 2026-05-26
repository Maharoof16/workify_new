"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Eye, EyeOff } from "lucide-react";

import { SubmitHandler, useForm } from "react-hook-form";

import { useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

import SignInlogo from "@/assets/sign-in.png";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AuthService } from "../auth.service";
import { login as authLogin } from "@/store/slice/auth-slice";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setLoading(true);
      try {
        const res = await AuthService.signIn({
          identifier: data.email,
          password: data.password,
        });
        if (res) {
          toast.success("Sign in successful!");
          dispatch(authLogin(res.data.user));
          router.push("/home");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.error("Login failed:", (error as Error).message);
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.error("Login failed:", (error as Error).message);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-linear-to-r from-[#ABD5F7] to-[#DAECFC]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT SIDE */}
        <div className="relative hidden min-h-screen lg:flex flex-col overflow-hidden justify-between">
          <div className="w-full py-14">
            <div className="mx-auto w-10/12">
              <Image
                priority
                unoptimized
                src="/logo.png"
                alt="Workify Logo"
                width={180}
                height={60}
                className="h-auto object-contain"
              />
            </div>
          </div>

          <Image
            src={SignInlogo}
            alt="Background Graphic"
            priority
            className="
          h-auto
          w-10/12
          object-contain
        "
          />
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            relative
            flex
            flex-col
            items-center
            gap-4
              "
        >
          {/* FORM CARD */}
          <div className="w-full max-w-lg px-6 py-10 md:py-20 md:px-20 md:rounded-lg md:shadow-lg bg-white">
            {/* LOGO */}
            <div className="mb-20 flex justify-center">
              <Image
                src={logo}
                alt="Logo"
                priority
                className="h-auto w-25 object-contain"
              />
            </div>
            {/* HEADING */}
            <div className="mb-8 text-center">
              <h1
                className="
                  text-3xl
                  font-semibold
                "
              >
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                To get started, Please login to your account
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="h-10 rounded-sm border-0  bg-muted/40 px-4 shadow-none"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  ref={(e) => {
                    register("email").ref(e);

                    emailInputRef.current = e;
                  }}
                />

                <label className="label-error mt-1">
                  {errors?.email?.message}
                </label>
              </div>

              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-10 rounded-sm border-0 bg-muted/40 px-4 pr-11 shadow-none"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <label className="label-error mt-1">
                  {errors?.password?.message}
                </label>
              </div>

              <Button disabled={loading} className="w-full rounded-sm py-5">
                {loading ? <Spinner color="white" /> : "Login"}
              </Button>
            </form>
          </div>

          {/* FOOTER */}
          <p
            className="
             
              text-xs
              text-primary
            "
          >
            © 2026 Vith IT Solutions. All Right Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
