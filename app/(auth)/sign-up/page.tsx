"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Lock, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setIsUsernameAvailable(null);
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
          setIsUsernameAvailable(true);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username",
          );
          setIsUsernameAvailable(false);
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage("");
        setIsUsernameAvailable(null);
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/sign-up`, data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Error signing up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">
              True <span className="text-gradient">Feedback</span>
            </h1>
          </Link>
          <p className="text-gray-400">Create your anonymous sanctuary</p>
        </div>

        {/* Sign Up Card */}
        <div className="card-elevated rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Create Account</h2>
            <p className="text-muted-foreground">Join thousands receiving honest feedback</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-white">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="username"
                  placeholder="Choose a unique username"
                  {...register("username")}
                  onChange={(e) => {
                    form.setValue("username", e.target.value);
                    debounced(e.target.value);
                  }}
                  className="pl-10 py-5 pr-10 bg-elevated border-border input-focus text-white placeholder:text-tertiary"
                />
                {isCheckingUsername && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 text-primary" />
                )}
                {!isCheckingUsername && isUsernameAvailable === true && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                )}
                {!isCheckingUsername && isUsernameAvailable === false && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
                )}
              </div>
              {usernameMessage && (
                <p className={`text-sm flex items-center gap-1 ${isUsernameAvailable ? 'text-success' : 'text-destructive'}`}>
                  {isUsernameAvailable ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {usernameMessage}
                </p>
              )}
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="pl-10 py-5 bg-elevated border-border input-focus text-white placeholder:text-tertiary"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...register("password")}
                  className="pl-10 py-5 bg-elevated border-border input-focus text-white placeholder:text-tertiary"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              <p className="text-xs text-tertiary">Must be at least 6 characters</p>
            </div>

            {/* Submit Button */}
            <Button
              disabled={isSubmitting || isCheckingUsername || isUsernameAvailable === false}
              className="w-full btn-primary py-6 text-lg"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-tertiary bg-surface">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link href="/sign-in">
            <Button
              className="w-full hover:text-gray-300"
            >
              Sign In Instead
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-tertiary mt-6">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
