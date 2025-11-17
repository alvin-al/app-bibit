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
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  seller?: string;
}

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token, logout } = useAuthStore();

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
        }
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [token]);

  //Delete product
  const deleteProduct = async (id: string) => {
    try {
      if (!token) return;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prev) => prev.filter((item) => item.id !== id));

      toast.success("Produk berhasil dihapus");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const loadingText = (
    <div className='flex justify-center gap-2 items-center text-2xl h-[80vh]'>
      <Spinner />
      <p>Loading Data</p>{" "}
    </div>
  );
  const productsNotFound = <>Products not found</>;

  return (
    <AuthGuard>
      {/* Header */}
      <div className='h-12 w-full shadow px-4 flex items-center justify-between'>
        <span className='font-semibold'>Berbenih</span>
        <span>
          <Button className='cursor-pointer' onClick={() => logout()}>
            Logout
          </Button>
        </span>
      </div>
      {/* Products item */}
      <div className='p-4'>
        <div className='mb-4'>
          <Link href={"/dashboard/create"}>
            <Button className='cursor-pointer' variant='outline'>
              Tambah produk
            </Button>
          </Link>
        </div>
        {loading && loadingText}{" "}
        {!loading && products.length === 0 && productsNotFound}
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {products.map((item) => (
            <Card key={item.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between font-medium'>
                  <span> Stock : {item.stock}</span>
                  <span className='text-green-600'>
                    Rp{item.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className='mt-4 space-x-2 flex'>
                  {" "}
                  <Link key={item.id} href={`/dashboard/edit/${item.id}`}>
                    <Button variant='secondary' className='cursor-pointer'>
                      Edit
                    </Button>
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

export default page;
