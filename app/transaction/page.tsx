import BottomNavbar from "@/components/BottomNavbar";
import PublicNavbar from "@/components/PublicNavbar";
import React from "react";

const Transaction = () => {
  return (
    <>
      {/* Navbar */}
      <PublicNavbar />
      {/* Content */}
      <div className='p-4'>page</div>
      <BottomNavbar />
    </>
  );
};

export default Transaction;
