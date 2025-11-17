"use client";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk harap diisi"),
  description: z.string(),
  price: z.coerce.number().min(1, "Harga tidak boleh kosong"),
  stock: z.coerce.number().min(0, "Stok harus angka"),
  imageUrl: z.url("URL tidak valid").optional().or(z.literal("")),
});

const EditProductPage = () => {
  //state
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();

  //setup RHF
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  //get old data
  useEffect(() => {
    setIsLoading(true);
    const getSelectedProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        //store data
        const productData = response.data.data;

        //fill data
        form.reset({
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          stock: productData.stock,
          imageUrl: productData.imageUrl || "",
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast(error.message);
        } else {
          toast("Terjadi kesalahan");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token && id) getSelectedProduct();
  }, [id, token, form, router]);

  //onsubmit
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast("Produk berhasil diedit!");
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast(error.response.data.message);
      }
      toast("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className='p-4'>
        {" "}
        <h1 className='font-medium text-2xl mb-4'>Edit Produk</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama produk</FormLabel>
                  <FormControl>
                    <Input placeholder='Nama barang' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi produk</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Deskripsi barang' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"stock"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok barang</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Stok barang'
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"price"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga barang</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Harga barang'
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name={"imageUrl"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Foto</FormLabel>
                  <FormControl>
                    <Input placeholder='Foto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <Button type='submit' disabled>
                Loading
              </Button>
            ) : (
              <Button type='submit'>Submit</Button>
            )}
          </form>
        </Form>
      </div>
    </AuthGuard>
  );
};

export default EditProductPage;
