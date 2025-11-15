"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHydrate, setIsHydrate] = useState<boolean>(false);
  const router = useRouter();

  const { token } = useAuthStore();

  useEffect(() => {
    setIsHydrate(true);
  }, []);

  useEffect(() => {
    if (!isHydrate) {
      return;
    }

    if (token === null) {
      router.push("/login");
      setIsLoading(false);
    }

    setIsLoading(false);
  }, []);

  if (!isHydrate && isLoading) {
    return <p>Loading</p>;
  }

  return <div>{children}</div>;
};

export default AuthGuard;
