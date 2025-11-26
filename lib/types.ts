export interface ProductTypes {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  seller?: string;
  age: string | null;
  unit: string;
  varieties: string;
}
