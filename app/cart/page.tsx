"use client";
import PublicNavbar from "@/components/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cartStore";
import Image from "next/image";
import React from "react";
import { FaRegTrashAlt, FaStore } from "react-icons/fa";

const Cart = () => {
  const products = useCartStore((state) => state.items);

  return (
    <>
      <PublicNavbar />
      <div className='p-4'>
        {products.map((product, index) => (
          <Card key={index} className='flex p-0 gap-0 flex-row'>
            {/* image */}
            <div className='aspect-square w-1/2 overflow-hidden relative rounded-lg'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  fill
                  objectFit='cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  alt={product.name}
                />
              ) : (
                <>No image</>
              )}
            </div>
            {/* description */}
            <div className='w-1/2 p-4 justify-between flex flex-col'>
              <div className=''>
                <h1 className='text-lg font-semibold'>{product.name}</h1>
                <div className='flex items-center gap-1 text-sm'>
                  <FaStore />
                  <p>{product.seller?.name}</p>
                </div>
                <p className='text-sm mt-2 text-green-700 font-semibold space-x-1'>
                  Rp{product?.price.toLocaleString("ID-id")}
                  <span className='text-gray-500'>/{product?.unit}</span>
                </p>
              </div>
              {/* qty button */}
              <div className='flex justify-between'>
                <div className='flex gap-1 '>
                  <Button variant='outline' size='sm'>
                    +
                  </Button>
                  <Input
                    type='number'
                    value={product.quantity}
                    className='h-8 px-1 w-10 text-center'
                  />
                  <Button variant='outline' size='sm'>
                    -
                  </Button>
                </div>
                <div>
                  <Button variant='destructive' size='sm'>
                    <FaRegTrashAlt />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Cart;
