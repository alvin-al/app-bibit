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
const formSchema = z.object({
  email: z.email({
    message: "Please enter valid email address",
  }),
  password: z.string().min(8, { message: "Password is required." }),
});

const Login = () => {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const { setToken, token } = useAuthStore();
  const router = useRouter();

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        values
      );

      toast.success("Login berhasil");

      setToken(response.data.token);
      console.log(token);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        return toast.error(err.response.data.message);
      }
      toast.error("Login gagal");
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
          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Loading
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
