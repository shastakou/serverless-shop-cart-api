import { Cart, CartItem, CartWithItems } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
// export function calculateCartTotal(cart: CartWithItems): number {
//   return cart
//     ? cart.cartItems.reduce(
//         (acc: number, { product: { price }, count }: CartItem) => {
//           return (acc += price * count);
//         },
//         0,
//       )
//     : 0;
// }
