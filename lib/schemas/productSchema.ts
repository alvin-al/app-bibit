import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk harap diisi"),
  description: z.string(),
  price: z.coerce.number().min(1, "Harga harap kosong"),
  stock: z.coerce.number().min(1, "Stok harus diisi"),
  imageUrl: z.url("URL tidak valid").optional().or(z.literal("")),
  age: z.string().min(1, "Umur harap diisi"),
  unit: z.string().min(1, "Unit harap diisi"),
  varieties: z.string().min(1, "Varietas harap diisi"),
});
