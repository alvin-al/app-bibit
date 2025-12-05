"use client";
import BottomNavbar from "@/components/BottomNavbar";
import PublicNavbar from "@/components/PublicNavbar";
import { useAuthStore } from "@/lib/store/authStore";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Account = () => {
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

  const { token, logout } = useAuthStore();
  return (
    <>
      <PublicNavbar />
      <div className='p-4'>
        {" "}
        <div>{token ? afterLoginButton : notLoginButton}</div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default Account;
