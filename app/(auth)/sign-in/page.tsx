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
import { Loader2 } from "lucide-react";
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

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })

    if(result?.error){
      toast.error(result.error || "Login Failed");
    } 

    if(result?.url){
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Join Mystery Message</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <Input placeholder="Email" {...form.register("identifier")} />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...form.register("password")}
            />
          </div>

          <Button
            disabled={isSubmitting}
            className="w-full"
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
