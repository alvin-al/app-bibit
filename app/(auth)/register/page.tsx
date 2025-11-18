"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";
import { Spinner } from "@/components/ui/spinner";

//Form schema
const formSchema = z
  .object({
    email: z.email({
      message: "Please enter valid email address",
    }),
    password: z.string().min(8, { message: "Password is required." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const { token } = useAuthStore();

  //check if user login
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    } else {
      setTimeout(() => {
        setIsChecking(false);
      }, 500);
    }
  }, [token, router]);

  //Form with RHF
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        values
      );

      toast.success("Pendaftaran berhasil! Silahkan login dengan akun anda");

      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat mendaftar");
      }
    }
  }

  //Loading animation
  if (isChecking) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='
          space-y-8 w-full max-w-sm'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='********' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='********' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
