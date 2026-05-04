"use client"
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifying(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Error verifying code");
    } finally {
        setIsVerifying(false);
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
          <p className="text-gray-400">Verify your account</p>
        </div>

        {/* Verify Card */}
        <div className="card-elevated rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-muted-foreground">
              We&apos;ve sent a verification code to your email
            </p>
            <p className="text-primary font-medium mt-2">@{param.username}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Verification Code Field */}
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-white">
                Verification Code
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  {...register("code")}
                  className="pl-10 py-5 mt-2 text-center text-2xl tracking-widest bg-elevated border-border input-focus text-white placeholder:text-tertiary font-mono"
                  maxLength={6}
                />
              </div>
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              disabled={isVerifying}
              className="w-full btn-primary py-6 text-lg"
              type="submit"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Verify Account
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
              <span className="px-4 text-tertiary bg-surface">Need help?</span>
            </div>
          </div>

          {/* Resend Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Didn&apos;t receive the code?
            </p>
            <Button
              onClick={() => toast.info("Resend feature coming soon!")}
            >
              Resend Code
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/sign-in" className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
