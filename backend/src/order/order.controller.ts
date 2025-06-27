import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateOrderDto) {
    return this.orderService.create(body.cartId, body.paymentMethod);
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.orderService.findByUserId(userId);
    }
    return this.orderService.findAll();
  }
}
