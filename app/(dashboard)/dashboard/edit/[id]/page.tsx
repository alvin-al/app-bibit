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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { productSchema } from "@/lib/schemas/productSchema";

const EditProductPage = () => {
  //state
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
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
      age: "",
      unit: "",
      varieties: "",
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
          age: productData.age || "",
          unit: productData.unit || "Pcs",
          varieties: productData.varieties || "",
        });

        setPreviewImage(productData.imageUrl || null);
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

  //handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileData = e.target.files[0];
      setFile(fileData);

      const preview = URL.createObjectURL(fileData);
      setPreviewImage(preview);
    }
  };

  //onsubmit
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      let finalImageUrl = values.imageUrl;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        finalImageUrl = uploadRes.data.url;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        { ...values, imageUrl: finalImageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Produk berhasil diedit!");
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      }
      toast.error("Terjadi kesalahan");
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
                  <FormLabel>
                    Nama produk<span className='text-red-500'>*</span>
                  </FormLabel>
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
                    <Textarea
                      placeholder='Misalnya : Tinggi bibit, kondisi bibit'
                      {...field}
                    />
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
                  <FormLabel>
                    Stok barang<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Stok barang'
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      value={(field.value as number) ?? 0}
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
                  <FormLabel>
                    Harga barang<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Harga barang'
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      value={(field.value as number) ?? 0}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name={"age"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Umur barang<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Misal : 2 minggu' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name={"unit"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Unit satuan<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Misal : Pcs' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name={"varieties"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Varietas<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Misalnya : F1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel className='mb-2'>URL Foto</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  placeholder='Foto'
                  onChange={(e) => handleFileChange(e)}
                />
              </FormControl>
              <FormMessage />
            </div>
            {previewImage && (
              <div className='mt-2'>
                <img
                  src={previewImage}
                  alt='Preview'
                  className='w-32 h-32 object-cover rounded-md border'
                  key={previewImage ? "loaded" : "empty"}
                />
              </div>
            )}
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
