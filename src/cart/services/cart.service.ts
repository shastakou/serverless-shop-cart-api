import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  CartModel,
  CartStatus,
  CartWithItemsModel,
  PurchasedProductDto,
} from '../models';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<CartWithItemsModel> {
    return this.prisma.cartModel.findFirst({
      where: { userId, status: CartStatus.OPEN },
      include: {
        cartItems: true,
      },
    });
  }

  async createByUserId(userId: string): Promise<CartWithItemsModel> {
    const userCart = {
      userId,
      status: CartStatus.OPEN,
    };

    const createdCart = await this.prisma.cartModel.create({ data: userCart });

    return { ...createdCart, cartItems: [] };
  }

  async findOrCreateByUserId(userId: string): Promise<CartWithItemsModel> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { productId, count }: PurchasedProductDto,
  ): Promise<CartWithItemsModel> {
    const cart = await this.findOrCreateByUserId(userId);

    const foundItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (foundItem) {
      foundItem.count = count;
      await this.prisma.cartItemModel.update({
        where: { id: foundItem.id },
        data: foundItem,
      });
    } else {
      const newItem = {
        cartId: cart.id,
        productId,
        count,
      };
      const createdItem = await this.prisma.cartItemModel.create({
        data: newItem,
      });
      cart.cartItems.push(createdItem);
    }

    return cart;
  }

  removeByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.cartModel.deleteMany({ where: { userId } });
  }

  updateStatus(id: string, status: CartStatus): Promise<CartModel> {
    return this.prisma.cartModel.update({ where: { id }, data: { status } });
  }
}
