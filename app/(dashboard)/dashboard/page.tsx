"use client";
import AuthGuard from "@/components/AuthGuard";
import DeleteButton from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductTypes } from "@/lib/types";

const Dashboard = () => {
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token, logout } = useAuthStore();
  const router = useRouter();

  //Get products
  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        if (!token) return;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) setProducts(response.data.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          toast.error(err.response.data.message);

          //logout when token expired
          if (err.response.status === 401) {
            logout();
            router.replace("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [token, router, logout]);

  //Delete product
  const deleteProduct = async (id: string) => {
    try {
      if (!token) return;
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((item) => item.id !== id));

      toast.success("Produk berhasil dihapus");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const loadingText = (
    <div className='flex justify-center gap-2 items-center h-[80vh]'>
      <Spinner />
      <p>Loading Data</p>{" "}
    </div>
  );
  const productsNotFound = (
    <div className='flex w-full h-[80vh] justify-center items-center flex-col'>
      <Image
        src='/noProduct.png'
        width={300}
        height={300}
        alt='Not product image'
        priority
      />
      <p className='font-medium text-lg'>Products not found</p>
    </div>
  );

  return (
    <AuthGuard>
      {/* Header */}
      <div className='flex h-16 items-center justify-between px-8 shadow bg-white'>
        <span className='font-semibold'>Berbenih</span>
        <span>
          <Button onClick={() => logout()} variant='outline'>
            Logout
          </Button>
        </span>
      </div>
      {/* Products item */}
      <div className='p-4'>
        <div className='mb-4'>
          <Link href={"/dashboard/create"}>
            <Button variant='outline'>Tambah produk</Button>
          </Link>
        </div>
        {loading && loadingText}{" "}
        {!loading && products.length === 0 && productsNotFound}
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {products.map((item) => (
            <Card key={item.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='w-32 h-32 mb-4 border rounded-lg overflow-hidden relative'>
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill priority />
                  ) : (
                    <div className='w-full h-full flex justify-center items-center text-xs text-gray-500'>
                      No Image
                    </div>
                  )}
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between font-medium'>
                  <span>
                    {" "}
                    Stok : {item.stock} {item.unit}
                  </span>
                  <span className='text-green-600'>
                    Rp{item.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className='mt-4 space-x-2 flex'>
                  {" "}
                  <Link key={item.id} href={`/dashboard/edit/${item.id}`}>
                    <Button variant='secondary'>Edit</Button>
                  </Link>
                  <DeleteButton
                    title={item.name}
                    onClick={() => deleteProduct(item.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
