"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false); // 1. Tambah ini
  const router = useRouter();

  const { token } = useAuthStore();

  //check component mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (token === null) {
      router.replace("/login");
    } else {
      setIsLoading(false);
    }
  }, [token, router, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center gap-3'>
        <Spinner />
        <p>Memuat halaman</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
