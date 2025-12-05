"use client";
import React from "react";
import { Button } from "./ui/button";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

const PublicNavbar = () => {
  return (
    <div className='flex h-16 items-center justify-between px-8 shadow bg-white'>
      <Link href={"/"}>
        <div className='font-semibold'>Berbenih</div>{" "}
      </Link>
      <Link href='/cart'>
        <Button variant='outline'>
          <FaShoppingCart />
        </Button>
      </Link>
    </div>
  );
};

export default PublicNavbar;
