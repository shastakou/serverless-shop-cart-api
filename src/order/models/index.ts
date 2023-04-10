import { OrderModel, OrderStatus } from '@prisma/client';
export { OrderModel, OrderStatus } from '@prisma/client';
import { CartWithItemsModel } from '../../cart/models';

export type OrderWithCartModel = OrderModel & {
  cart: CartWithItemsModel;
};

export type OrderDto = {
  id: string;
  address: {
    address: string;
    comment: string;
    firstName: string;
    lastName: string;
  };
  items: {
    count: number;
    productId: string;
  }[];
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    comment: string;
  }[];
};

export type OrderCreateDto = {
  address: {
    address: string;
    comment: string;
    firstName: string;
    lastName: string;
  };
  items: {
    count: number;
    productId: string;
    price: number;
  }[];
};

export type OrderStatusUpdateDto = {
  status: OrderStatus;
  comment: string;
};

export const mapOrderModelToOrderDto = (
  order: OrderWithCartModel,
): OrderDto => {
  const delivery = order.delivery as OrderDto['address'];

  return {
    id: order.id,
    address: delivery,
    items: order.cart.cartItems,
    statusHistory: [
      {
        status: order.status,
        timestamp: order.cart.updatedAt,
        comment: delivery.comment,
      },
    ],
  };
};
