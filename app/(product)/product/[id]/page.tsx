"use client";
import { ProductTypes } from "@/lib/types";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FaStore } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductDetails = () => {
  const [product, setProduct] = useState<ProductTypes | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();

  //fetch data API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/public/${id}`
        );

        setProduct(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Error fetching data : ", error);
          toast.error(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // list detail component
  const detailData = [
    { title: "Lokasi", detail: "Sleman" },
    { title: "Umur", detail: product?.age },
    { title: "Stok", detail: product?.stock + " " + product?.unit },
    { title: "Varietas", detail: product?.varieties },
    { title: "Penjual", detail: product?.seller?.name },
  ];

  return (
    <div className='pb-24'>
      {/* product image */}
      <div className='w-full relative aspect-square rounded-lg overflow-hidden'>
        {isLoading ? (
          <Skeleton className='w-ful h-full aspect-square rounded-lg bg-gray-200' />
        ) : (
          <Image
            src={product?.imageUrl || ""}
            fill
            alt={product?.name || ""}
            priority
          />
        )}
      </div>{" "}
      {/* Product title */}
      <div className='my-4 space-y-2'>
        <p className='text-2xl font-bold'>{product?.name}</p>
        <p className='text-2xl text-green-700 font-semibold space-x-1'>
          Rp{product?.price}
          <span className='text-sm text-gray-500'>/{product?.unit}</span>
        </p>
        <div className='flex items-center gap-2 mb-1 font-normal'>
          <FaStore />
          {product?.seller?.name}
        </div>
      </div>
      {/* product details */}
      <div>
        <Card className=''>
          <CardHeader>
            <CardTitle className='mb-0 font-semibold'>Deskripsi</CardTitle>
            <CardDescription>{product?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className='mb-2 font-semibold'>Detail Produk</CardTitle>
            <div className='grid grid-cols-2 space-y-4 '>
              {detailData.map((item) => (
                <div className='flex flex-col' key={item.title}>
                  <span className='uppercase text-xs font-semibold text-gray-500'>
                    {item.title}
                  </span>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
