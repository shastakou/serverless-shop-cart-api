import { Cart, CartItem } from '@prisma/client';
export { CartStatus, Cart, CartItem } from '@prisma/client';

export type CartWithItems = Cart & {
  cartItems: CartItem[];
};

export type PurchasedProduct = { productId: string; count: number };
