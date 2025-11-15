import AuthGuard from "@/components/AuthGuard";
import React from "react";

const page = () => {
  return (
    <AuthGuard>
      <div>
        <h1>Ini Halaman Dashboard</h1>
      </div>
    </AuthGuard>
  );
};

export default page;
