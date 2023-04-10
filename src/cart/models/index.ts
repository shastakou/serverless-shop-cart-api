import { CartModel, CartItemModel } from '@prisma/client';

export { CartStatus, CartModel, CartItemModel } from '@prisma/client';

export type CartWithItemsModel = CartModel & {
  cartItems: CartItemModel[];
};

export type PurchasedProductDto = { productId: string; count: number };
