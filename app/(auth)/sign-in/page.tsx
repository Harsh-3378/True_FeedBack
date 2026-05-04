"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })

    if(result?.error){
      toast.error(result.error || "Login Failed");
      setIsSubmitting(false);
    } 

    if(result?.url){
      toast.success("Welcome back!");
      router.push('/dashboard');
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
          <p className="text-gray-400">Welcome back to your sanctuary</p>
        </div>

        {/* Sign In Card */}
        <div className="card-elevated rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/Username Field */}
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium text-white">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="identifier"
                  placeholder="Enter your email or username"
                  {...register("identifier")}
                  className="pl-10 py-5 bg-elevated border-border input-focus text-white placeholder:text-tertiary"
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-destructive">{errors.identifier.message}</p>
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
                  placeholder="Enter your password"
                  {...register("password")}
                  className="pl-10 py-5 bg-elevated border-border input-focus text-white placeholder:text-tertiary"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              disabled={isSubmitting}
              className="w-full btn-primary py-6 text-lg"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
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
              <span className="px-4 text-tertiary bg-surface">New here?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link href="/sign-up">
            <Button
              className="w-full hover:text-gray-300"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create an Account
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-tertiary mt-6">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
