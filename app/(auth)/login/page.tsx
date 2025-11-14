"use client";
import { useRouter } from "next/navigation";
import React from "react";
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

//Form schema
const formSchema = z.object({
  email: z.email({
    message: "Please enter valid email address",
  }),
  password: z.string().min(8, { message: "Password is required." }),
});

const API_URL = "http://localhost:4000/api/auth";

const Login = () => {
  const router = useRouter();

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
      const response = await axios.post(`${API_URL}/login`, values);

      toast.success("Login berhasil");

      console.log(response.data.token);
      router.push("/");
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        return toast.error(err.response.data.message);
      }
      toast.error("Login gagal");
    }
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
            {form.formState.isSubmitting ? "Loading" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
