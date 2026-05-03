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

const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Account</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
                    <Input
                        id="code"
                        {...form.register("code")}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                >
                    {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
            </form>
        </div>
    </div>
  );
};

export default VerifyAccount;
