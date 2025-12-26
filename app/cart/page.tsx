"use client";
import PublicNavbar from "@/components/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useCartStore } from "@/lib/store/cartStore";
import { CartItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { FaStore } from "react-icons/fa";

const Cart = () => {
  const hasMounted = useHasMounted();

  // Ambil fungsi toggle dari Zustand (Store)
  // Pastikan toggleSelect sudah kamu buat di cartStore.ts
  const {
    items: products,
    updateQuantity,
    removeItem,
    toggleSelect,
  } = useCartStore();

  // 1. Group & sort (Tetap sama)
  const groupedItems = useMemo(() => {
    if (!products.length) return {};
    const sortedProducts = [...products].sort(
      (a, b) =>
        new Date((b as any).updatedCartAt || 0).getTime() -
        new Date((a as any).updatedCartAt || 0).getTime()
    );
    return sortedProducts.reduce((acc, item) => {
      const sellerId = item.seller?.name || "default";
      const sellerName = item.seller?.name || "Toko Lain";
      if (!acc[sellerId]) acc[sellerId] = { sellerName, items: [] };
      acc[sellerId].items.push(item);
      return acc;
    }, {} as Record<string, { sellerName: string; items: CartItem[] }>);
  }, [products]);

  // ✅ PERBAIKAN: Hitung total terpilih dari store
  const selectedCount = products.filter((item) => item.isSelected).length;

  // ✅ PERBAIKAN: Toggle item selection (Store-based)
  const toggleItem = useCallback(
    (id: string) => {
      toggleSelect(id);
    },
    [toggleSelect]
  );

  // ✅ PERBAIKAN: Toggle all items in a seller group (Store-based)
  const toggleSeller = useCallback(
    (sellerId: string) => {
      const sellerItems = groupedItems[sellerId]?.items || [];
      const allSelected = sellerItems.every((item) => item.isSelected);

      sellerItems.forEach((item) => {
        // Jika sudah terpilih semua, matikan yang nyala.
        // Jika belum semua, nyalakan yang masih mati.
        if (allSelected) {
          if (item.isSelected) toggleSelect(item.id);
        } else {
          if (!item.isSelected) toggleSelect(item.id);
        }
      });
    },
    [groupedItems, toggleSelect]
  );

  // ✅ PERBAIKAN: Cek apakah semua item di seller terpilih (Store-based)
  const isSellerSelected = useCallback(
    (sellerId: string) => {
      const items = groupedItems[sellerId]?.items || [];
      return items.length > 0 && items.every((item) => item.isSelected);
    },
    [groupedItems]
  );

  const getSubtotal = useCallback((items: CartItem[]) => {
    return items.reduce((sum, item) => {
      // Opsional: Jika ingin subtotal hanya menghitung yang dicentang:
      // if (!item.selected) return sum;
      return sum + item.price * item.quantity;
    }, 0);
  }, []);

  if (!hasMounted) return <div className='p-10 text-center'>Memuat...</div>;

  return (
    <>
      <PublicNavbar />
      <div className='p-4 max-w-4xl mx-auto'>
        <div className='space-y-6'>
          {Object.entries(groupedItems).map(
            ([sellerId, { sellerName, items }]) => {
              const subtotal = getSubtotal(items);
              return (
                <div
                  key={sellerId}
                  className='border rounded-lg overflow-hidden'
                >
                  {/* Seller Header */}
                  <div className='bg-gray-50 px-4 py-3 flex items-center space-x-2'>
                    <Checkbox
                      checked={isSellerSelected(sellerId)}
                      onCheckedChange={() => toggleSeller(sellerId)}
                      className='border-gray-400 w-5 h-5'
                    />
                    <FaStore className='text-gray-600 flex-shrink-0' />
                    <div className='flex-1'>
                      <h2 className='font-semibold text-gray-800'>
                        {sellerName}
                      </h2>
                      <p className='text-xs text-gray-500'>
                        Subtotal: Rp{subtotal.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className='divide-y'>
                    {items.map((product) => (
                      <Card
                        key={product.id}
                        className='flex p-3 gap-4 items-start'
                      >
                        <Checkbox
                          checked={product.isSelected}
                          onCheckedChange={() => toggleItem(product.id)}
                          className='border-gray-400 w-5 h-5 mt-1 flex-shrink-0'
                        />

                        {/* Image */}
                        <div className='aspect-square w-16 h-16 overflow-hidden relative rounded bg-gray-100 flex-shrink-0'>
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              fill
                              className='object-cover'
                              alt={product.name}
                              sizes='64px'
                            />
                          ) : (
                            <div className='flex items-center justify-center text-xs text-gray-400'>
                              ?
                            </div>
                          )}
                        </div>

                        {/* Info & Controls */}
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-medium text-sm line-clamp-2 mb-1'>
                            {product.name}
                          </h3>
                          <p className='text-sm text-green-700 font-bold'>
                            Rp{product.price.toLocaleString("id-ID")}
                            {product.unit && (
                              <span className='text-gray-500 font-normal'>
                                /{product.unit}
                              </span>
                            )}
                          </p>

                          {/* Qty + Hapus */}
                          <div className='flex items-center justify-between mt-2'>
                            <div className='flex items-center border rounded-lg overflow-hidden'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 text-gray-600'
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    product.quantity - 1
                                  )
                                }
                                disabled={product.quantity <= 1}
                              >
                                −
                              </Button>
                              <Input
                                type='number'
                                min='1'
                                value={product.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    product.id,
                                    Math.max(1, parseInt(e.target.value) || 1)
                                  )
                                }
                                className='h-8 w-12 text-center border-x-0 rounded-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                              />
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 text-gray-600'
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    product.quantity + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>

                            <Button
                              variant='link'
                              size='sm'
                              className='text-red-500 h-7 px-2'
                              onClick={() => removeItem(product.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>{" "}
      {/* Summary & Checkout (Opsional) */}
      <div className='p-4 bg-white border  shadow-sm sticky bottom-0'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-gray-700'>Total terpilih:</span>
          <span className='font-bold'>{selectedCount} item</span>
        </div>
        <Link href='/checkout'>
          <Button className='w-full' disabled={selectedCount === 0}>
            Lanjutkan ke Checkout ({selectedCount})
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Cart;
