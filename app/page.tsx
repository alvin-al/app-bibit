"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Spinner } from "@/components/ui/spinner";
import { FaStore, FaStar } from "react-icons/fa";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [searchProducts, setSearchProducts] = useState<string>("");
  const debounceQuery = useDebounce(searchProducts, 300);

  // fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/public`,
          {
            params: {
              search: debounceQuery,
            },
          }
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
  }, [debounceQuery]);

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
            <Input
              className='pl-10'
              placeholder='Cari bibit'
              value={searchProducts}
              onChange={(e) => setSearchProducts(e.target.value)}
            />
          </div>
        </div>
        {/* Product not found */}
        {!loading && products.length === 0 && productsNotFound}
        {loading ? (
          <div className='w-full flex justify-center'>
            <Spinner />
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-2 xl:grid-cols-4'>
            {products.map((item) => (
              <Card
                key={item.id}
                className='hover:shadow-lg transition-shadow p-0 gap-0 min-h-[300px]'
              >
                <CardHeader className='p-0 h-40'>
                  <div className='w-full h-40 border-b rounded-lg overflow-hidden relative'>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex justify-center items-center text-xs text-gray-500'>
                        No Image
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='p-2 h-full flex flex-col justify-between '>
                  <div>
                    <div>
                      <p className='mb-2 text-xs font-semibold'>
                        Rp{item.price.toLocaleString("id-ID")}/{item.unit}
                      </p>
                    </div>
                    <div className='flex items-center gap-1 mb-1 text-xs font-normal'>
                      <FaStore />
                      {item.seller?.name}
                    </div>
                    <div>
                      <p className='text-sm font-semibold'>
                        {item.name}{" "}
                        <span className='text-sm font-normal'>
                          ({item.varieties})
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className='text-xs'>
                    <div className='flex items-center gap-1'>
                      <FaStar />
                      4.5
                    </div>
                    <div>
                      {" "}
                      <p>
                        Stok : {item.stock} {item.unit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
