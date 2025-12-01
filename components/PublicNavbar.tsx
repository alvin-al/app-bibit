"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const PublicNavbar = () => {
  const { token, logout } = useAuthStore();

  //button template if login
  const afterLoginButton = (
    <div className='space-x-2'>
      <Link href='/dashboard'>
        <Button>Dashboard Penjual</Button>
      </Link>
      <Button onClick={() => logout()} variant='outline'>
        Logout
      </Button>
    </div>
  );

  //button template if not login
  const notLoginButton = (
    <>
      <div className='space-x-4'>
        <Link href='/register'>
          <Button variant='outline'>Daftar</Button>
        </Link>
        <Link href='/login'>
          <Button>Login</Button>
        </Link>
      </div>
    </>
  );

  return (
    <div className='flex h-16 items-center justify-between px-8 shadow bg-white'>
      <Link href={"/"}>
        <div className='font-semibold'>Berbenih</div>{" "}
      </Link>
      <div>{token ? afterLoginButton : notLoginButton}</div>
    </div>
  );
};

export default PublicNavbar;
