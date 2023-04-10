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
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { PurchasedProduct } from './models';

@Controller('profile/cart')
export class CartController {
  constructor(private cartService: CartService) {}

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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('checkout')
  async checkout(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      throw new BadRequestException('User ID is not provided');
    }

    const cart = await this.cartService.findByUserId(userId);

    if (!cart || !cart.cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    // await this.cartService.updateStatus(cart.id, CartStatus.ORDERED);
  }
}
