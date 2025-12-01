import BottomProductBar from "@/components/BottomProductBar";
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
      <div className='top-0 sticky z-10'>
        <PublicNavbar />
      </div>
      <div className='p-4'>{children}</div>
      <BottomProductBar />
    </>
  );
}
