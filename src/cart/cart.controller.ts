import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';

import { BasicAuthGuard /* JwtAuthGuard  */ } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { CartStatus, PurchasedProduct } from './models';

@Controller('profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  findUserCart(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      throw new BadRequestException('User ID is not provided');
    }

    return this.cartService.findOrCreateByUserId(userId);
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put()
  updateUserCart(@Req() req: AppRequest, @Body() body: PurchasedProduct) {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      throw new BadRequestException('User ID is not provided');
    }

    return this.cartService.updateByUserId(userId, body);
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete()
  clearUserCart(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      throw new BadRequestException('User ID is not provided');
    }

    return this.cartService.removeByUserId(userId);
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      throw new BadRequestException('User ID is not provided');
    }

    const cart = await this.cartService.findByUserId(userId);

    if (!cart || !cart.cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    await this.cartService.changeStatusById(cart.id, CartStatus.ORDERED);

    // const { id: cartId, items } = cart;
    // const total = calculateCartTotal(cart);
    // const order = this.orderService.create({
    //   ...body, // TODO: validate and pick only necessary data
    //   userId,
    //   cartId,
    //   items,
    //   total,
    // });
    // this.cartService.removeByUserId(userId);

    // return {
    //   data: { order },
    // };
  }
}
