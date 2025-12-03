"use client";
import React from "react";
import { Button } from "./ui/button";
import { FaShareAlt, FaShoppingCart } from "react-icons/fa";
import { CartItem } from "@/lib/types";
import { useCartStore } from "@/lib/store/cartStore";

const BottomProductBar = ({ cart }: { cart: CartItem }) => {
  const { addItem } = useCartStore();

  return (
    <div className='w-full h-16 absolute bottom-0 border border-gray-200 shadow flex items-center space-x-1 p-4 z-0 bg-white'>
      <Button className='flex-auto'>Beli</Button>
      <Button variant='outline' onClick={() => addItem(cart)}>
        <FaShoppingCart />
      </Button>
      <Button variant='outline'>
        <FaShareAlt />
      </Button>
    </div>
  );
};

export default BottomProductBar;
