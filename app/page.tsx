"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import axios, { isAxiosError } from "axios";
import { ProductTypes } from "@/lib/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";

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
        <div>
          <div className='mb-4 flex items-center'>
            <div className='absolute pl-3'>
              <IoSearchSharp size='1.2em' />
            </div>
            <Input className='pl-10' placeholder='Cari bibit' />
          </div>
        </div>
        {!loading && products.length === 0 && productsNotFound}
        <div className='grid gap-4 grid-cols-2 xl:grid-cols-4'>
          {products.map((item) => (
            <Card
              key={item.id}
              className='hover:shadow-lg transition-shadow p-0'
            >
              <CardHeader className='p-0'>
                <div className='w-full h-48 border-b rounded-lg overflow-hidden relative'>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className='object-cover'
                      priority
                    />
                  ) : (
                    <div className='w-full h-full flex justify-center items-center text-xs text-gray-500'>
                      No Image
                    </div>
                  )}
                </div>
                <div className='px-2 space-y-1'>
                  <CardTitle className='font-normal text-base overflow-clip'>
                    {item.name}
                  </CardTitle>
                  <CardDescription className=''>
                    {" "}
                    <div>Varietas : {item.varieties}</div>
                    <div>Penjual : {item.seller?.name}</div>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className='px-2'>
                <div className='flex justify-between text-base'>
                  <p>
                    Stok : {item.stock} {item.unit}
                  </p>
                </div>
                <div>
                  {" "}
                  <p className='text-gray-800 font-bold text-lg '>
                    Rp{item.price.toLocaleString("id-ID")}/{item.unit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
