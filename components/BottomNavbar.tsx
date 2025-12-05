"use client";
import React from "react";
import { FiHome } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdOutlineAccountCircle } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const listItem = [
  { name: "Home", icon: <FiHome size='1.6em' />, link: "/" },
  { name: "Produk", icon: <AiOutlineProduct size='1.6em' />, link: "/product" },
  {
    name: "Transaksi",
    icon: <HiOutlineClipboardList size='1.6em' />,
    link: "/transaction",
  },
  {
    name: "Akun",
    icon: <MdOutlineAccountCircle size='1.6em' />,
    link: "/account",
  },
];

const BottomNavbar = () => {
  const router = usePathname();
  console.log(router);

  return (
    <div className='w-full h-16 absolute bottom-0 border border-gray-200 shadow grid grid-cols-4 bg-white items-center justify-items-center'>
      {listItem.map((item) => (
        <Link href={item.link} key={item.name}>
          <button>
            <div
              className={`${
                router == item.link ? "text-green-700" : "text-black/80"
              } items-center flex flex-col `}
            >
              {item.icon}
              <p className='text-xs mt-0.5'>{item.name}</p>
            </div>
          </button>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavbar;
