import PublicNavbar from "@/components/PublicNavbar";
import React from "react";

export default function page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {" "}
      <div className='top-0 sticky z-50'>
        <PublicNavbar />
      </div>
      <div>{children}</div>
    </>
  );
}
