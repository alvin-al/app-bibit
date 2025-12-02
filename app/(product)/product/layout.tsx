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
      <div className='top-0 sticky z-50'>
        <PublicNavbar />
      </div>
      <div className='p-4'>{children}</div>
      <div className='bottom-0 sticky z-50'>
        {" "}
        <BottomProductBar />
      </div>
    </>
  );
}
