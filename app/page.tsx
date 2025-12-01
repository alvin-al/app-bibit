"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [searchProducts, setSearchProducts] = useState<string>("");
  const [tempSearch, setTempSearch] = useState<string>("");

  // fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/public`,
          {
            params: {
              search: searchProducts,
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
  }, [searchProducts]);

  const productsNotFound = <>Produk tidak ada</>;

  return (
    <main>
      {" "}
      <div className='top-0 sticky z-10'>
        <PublicNavbar />
      </div>
      {/* All data */}
      <div className='p-4'>
        <div>
          <div className='mb-4 flex items-center space-x-2'>
            <div className='absolute pl-3'>
              <IoSearchSharp size='1.2em' />
            </div>
            <Input
              className='pl-10'
              placeholder='Cari bibit'
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
            />
            <div>
              <Button
                variant='outline'
                onClick={() => setSearchProducts(tempSearch)}
              >
                Cari
              </Button>
            </div>
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
              <Link href={`/product/${item.id}`} key={item.id}>
                <Card
                  key={item.id}
                  className='hover:shadow-lg transition-shadow p-0 gap-0 min-h-[320px]'
                >
                  <CardHeader className='p-0 h-40'>
                    <div className='w-full h-40 border-b rounded-lg overflow-hidden relative'>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className='object-cover'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      ) : (
                        <div className='w-full h-40 flex justify-center items-center text-xs text-gray-500'>
                          No Image
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='p-3 h-[160px] flex flex-col justify-between'>
                    <div>
                      <div className='line-clamp-2'>
                        <p className='font-semibold'>
                          {item.name}{" "}
                          <span className='font-normal'>
                            ({item.varieties})
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className='mb-2 font-semibold text-green-600'>
                          Rp{item.price.toLocaleString("id-ID")}/{item.unit}
                        </p>
                      </div>
                    </div>
                    <div className='text-xs text-gray-600 space-y-1'>
                      <div className='flex items-center gap-1 mb-1 font-normal'>
                        <FaStore />
                        {item.seller?.name}
                      </div>
                      <div className='flex items-center gap-1 text-xs'>
                        <FaStar color='orange' />
                        4.5
                      </div>
                      <div>
                        <p>
                          Stok: {item.stock} {item.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
