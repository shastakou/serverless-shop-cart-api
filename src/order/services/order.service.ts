import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateOrderDto,
  OrderModel,
  OrderStatus,
  OrderStatusUpdateDto,
  OrderWithCartModel,
} from '../models';
import { CartService } from '../../cart/services';
import { CartStatus } from '../../cart/models';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  async findById(id: string): Promise<OrderWithCartModel> {
    return this.prisma.orderModel.findUnique({
      where: { id },
      include: {
        cart: { include: { cartItems: true } },
      },
    });
  }

  async findAll(): Promise<OrderWithCartModel[]> {
    return this.prisma.orderModel.findMany({
      include: {
        cart: { include: { cartItems: true } },
      },
    });
  }

  async create(userId: string, data: CreateOrderDto): Promise<OrderModel> {
    const cart = await this.cartService.findByUserId(userId);

    const newOrder = {
      userId,
      cartId: cart.id,
      payment: {},
      delivery: data.address,
      status: OrderStatus.OPEN,
      total: data.items.reduce(
        (acc, item) => (acc += item.count * item.price),
        0,
      ),
    };
    const order = this.prisma.orderModel.create({
      data: newOrder,
    });
    await this.cartService.updateStatus(cart.id, CartStatus.ORDERED);
    return order;
  }

  async updateStatus(
    id: string,
    { status, comment }: OrderStatusUpdateDto,
  ): Promise<OrderModel> {
    const order = await this.prisma.orderModel.findUnique({
      where: { id },
    });
    const delivery = typeof order.delivery === 'object' ? order.delivery : {};

    return this.prisma.orderModel.update({
      where: { id },
      data: {
        status,
        delivery: { ...delivery, comment },
      },
    });
  }

  remove(id: string): Promise<OrderModel | null> {
    return this.prisma.orderModel.delete({ where: { id } });
  }
}
