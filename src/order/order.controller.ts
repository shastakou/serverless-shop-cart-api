import {
  Controller,
  Get,
  Delete,
  Put,
  Req,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import {
  CreateOrderDto,
  OrderStatusUpdateDto,
  mapOrderModelToOrderDto,
} from './models';
import { CartService } from '../cart/services';
import { OrderService } from './services';
import { AppRequest } from 'src/shared';
import { getUserIdFromRequest } from '../shared';

@Controller('order')
export class OrderController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    const orders = await this.orderService.findAll();

    return orders.map(order => mapOrderModelToOrderDto(order));
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOrder(@Param('id') id: string) {
    const order = await this.orderService.findById(id);

    return mapOrderModelToOrderDto(order);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put()
  async create(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      throw new BadRequestException('User ID is not provided');
    }

    return this.orderService.create(userId, body);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id/status')
  update(@Param('id') id: string, @Body() body: OrderStatusUpdateDto) {
    return this.orderService.updateStatus(id, body);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.orderService.remove(id);
    } catch (e) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }
}
