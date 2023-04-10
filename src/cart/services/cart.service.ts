import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Cart, CartStatus, CartWithItems, PurchasedProduct } from '../models';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<CartWithItems> {
    return this.prisma.cart.findFirst({
      where: { userId, status: CartStatus.OPEN },
      include: {
        cartItems: true,
      },
    });
  }

  async createByUserId(userId: string): Promise<CartWithItems> {
    const userCart = {
      userId,
      status: CartStatus.OPEN,
    };

    const createdCart = await this.prisma.cart.create({ data: userCart });

    return { ...createdCart, cartItems: [] };
  }

  async findOrCreateByUserId(userId: string): Promise<CartWithItems> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { productId, count }: PurchasedProduct,
  ): Promise<CartWithItems> {
    const cart = await this.findOrCreateByUserId(userId);

    const foundItem = cart.cartItems.find(item => item.productId === productId);
    if (foundItem) {
      foundItem.count = count;
      await this.prisma.cartItem.update({
        where: { id: foundItem.id },
        data: foundItem,
      });
    } else {
      const newItem = {
        cartId: cart.id,
        productId,
        count,
      };
      const createdItem = await this.prisma.cartItem.create({
        data: newItem,
      });
      cart.cartItems.push(createdItem);
    }

    return cart;
  }

  removeByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.cart.deleteMany({ where: { userId } });
  }

  updateStatus(id: string, status: CartStatus): Promise<Cart> {
    return this.prisma.cart.update({ where: { id }, data: { status } });
  }
}
