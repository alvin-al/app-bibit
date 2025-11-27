"use client";

import DeleteButton from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import axios, { isAxiosError } from "axios";
import { ProductTypes } from "@/lib/types";
import { toast } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductTypes[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/public`
        );

        if (response) setProducts(response.data.data);
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          console.error("Error get public data: ", error);
          toast.error(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const productsNotFound = <>Produk tidak ada</>;

  return (
    <main>
      <div className='top-0 sticky z-10'>
        <PublicNavbar />
      </div>
      {/* All data */}
      <div className='p-4'>
        {!loading && products.length === 0 && productsNotFound}
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {products.map((item) => (
            <Card key={item.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='w-32 h-32 mb-4 border rounded-lg overflow-hidden relative'>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={300}
                      height={300}
                      className='object-cover'
                      priority
                    />
                  ) : (
                    <div className='w-full h-full flex justify-center items-center text-xs text-gray-500'>
                      No Image
                    </div>
                  )}
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className='space-y-2'>
                  <div>{item.description}</div>
                  <div>{item.seller?.name}</div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between font-medium'>
                  <span>
                    Stok : {item.stock} {item.unit}
                  </span>
                  <span className='text-green-600'>
                    Rp{item.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
