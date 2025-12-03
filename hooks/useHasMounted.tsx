"use client";
import React, { useEffect, useState } from "react";

export const useHasMounted = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
