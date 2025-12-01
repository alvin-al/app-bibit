"use client";
import { ProductTypes } from "@/lib/types";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div>
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
      </div>
    </div>
  );
};

export default ProductDetails;
