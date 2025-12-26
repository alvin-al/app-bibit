"use client";
import { useCartStore } from "@/lib/store/cartStore";
import { useHasMounted } from "@/hooks/useHasMounted";
import PublicNavbar from "@/components/PublicNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

const CheckoutPage = () => {
  const hasMounted = useHasMounted();
  const { items, totalPrice } = useCartStore();

  // State untuk form alamat
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    fullAddress: "",
  });

  // 1. Ambil hanya barang yang dipilih (selected)
  const selectedItems = useMemo(() => {
    return items.filter((item) => item.isSelected);
  }, [items]);

  // 2. Hitung total harga barang yang dipilih saja
  const finalPrice = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const handleCheckout = () => {
    if (!addressData.name || !addressData.phone || !addressData.fullAddress) {
      toast.error("Mohon lengkapi alamat pengiriman");
      return;
    }

    // Di sini nanti logika kirim data ke API (Create Order)
    console.log("Pesanan dibuat:", {
      items: selectedItems,
      address: addressData,
    });
    toast.success("Pesanan berhasil dibuat!");
  };

  if (!hasMounted) return null;
  if (selectedItems.length === 0)
    return (
      <div className='p-10 text-center'>Tidak ada barang yang dipilih.</div>
    );

  return (
    <>
      <PublicNavbar />
      <div className='max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* KOLOM KIRI: FORM ALAMAT & SUMMARY */}
        <div className='md:col-span-2 space-y-6'>
          {/* Form Alamat */}
          <Card className='p-4 space-y-4'>
            <h2 className='text-lg font-bold border-b pb-2'>
              Alamat Pengiriman
            </h2>
            <div className='space-y-3'>
              <Input
                placeholder='Nama Penerima'
                onChange={(e) =>
                  setAddressData({ ...addressData, name: e.target.value })
                }
              />
              <Input
                placeholder='Nomor WhatsApp (Aktif)'
                type='tel'
                onChange={(e) =>
                  setAddressData({ ...addressData, phone: e.target.value })
                }
              />
              <Textarea
                placeholder='Alamat Lengkap (Nama Jalan, RT/RW, Patokan Rumah)'
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    fullAddress: e.target.value,
                  })
                }
              />
            </div>
          </Card>

          {/* Ringkasan Barang */}
          <Card className='p-4'>
            <h2 className='text-lg font-bold border-b pb-2 mb-4'>
              Daftar Barang
            </h2>
            <div className='space-y-4'>
              {selectedItems.map((item) => (
                <div key={item.id} className='flex gap-4 items-center'>
                  <div className='relative w-16 h-16 rounded-lg overflow-hidden border'>
                    <Image
                      src={item.imageUrl || ""}
                      fill
                      alt={item.name}
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-sm'>{item.name}</h3>
                    <p className='text-xs text-gray-500'>
                      {item.quantity} x Rp{item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className='font-bold text-sm'>
                    Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* KOLOM KANAN: TOTAL & ACTION */}
        <div className='md:col-span-1'>
          <Card className='p-4 sticky top-20 space-y-4 shadow-md border-2 border-green-100'>
            <h2 className='font-bold text-gray-700'>Ringkasan Biaya</h2>
            <div className='flex justify-between text-sm'>
              <span>Total Harga ({selectedItems.length} barang)</span>
              <span>Rp{finalPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Biaya Pengiriman</span>
              <span className='text-green-600 font-medium'>Gratis/COD</span>
            </div>
            <hr />
            <div className='flex justify-between items-center'>
              <span className='font-bold text-lg'>Total Bayar</span>
              <span className='font-extrabold text-xl text-orange-600'>
                Rp{finalPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              className='w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold rounded-full'
              onClick={handleCheckout}
            >
              Buat Pesanan
            </Button>
            <p className='text-[10px] text-center text-gray-400'>
              Dengan menekan tombol, Anda setuju dengan syarat dan ketentuan
              yang berlaku.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
