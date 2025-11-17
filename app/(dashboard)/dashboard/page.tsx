"use client";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";
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
          toast(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [token]);

  const loadingText = <>Loading Data</>;
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
        {loading && loadingText}{" "}
        {!loading && products.length === 0 && productsNotFound}
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {products.map((item) => (
            <Card key={item.id} className='hover:shadow-lg transition-shadow '>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
};

export default page;
