"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const { token } = useAuthStore();

  useEffect(() => {
    if (token === null) {
      return router.push("/login");
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p>Loading</p>;
  }

  return <div>{children}</div>;
};

export default AuthGuard;
