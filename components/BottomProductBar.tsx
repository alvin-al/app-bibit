import React from "react";
import { Button } from "./ui/button";
import { FaShareAlt, FaShoppingCart } from "react-icons/fa";

const BottomProductBar = () => {
  return (
    <div className='w-full h-14 absolute bottom-0 border border-gray-200 shadow flex items-center space-x-1 p-4 z-0'>
      <Button className='flex-auto'>Beli</Button>
      <Button variant='outline'>
        <FaShoppingCart />
      </Button>
      <Button variant='outline'>
        <FaShareAlt />
      </Button>
    </div>
  );
};

export default BottomProductBar;
