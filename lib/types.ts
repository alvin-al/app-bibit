export interface ProductTypes {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  age: string | null;
  unit: string;
  varieties: string;
  seller?: {
    name: string | null;
    email: string;
  };
}
