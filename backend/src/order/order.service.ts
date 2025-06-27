import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(cartId: string, paymentMethod: string) {
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) throw new NotFoundException('Carrinho não encontrado');

    return this.prisma.order.create({
      data: {
        cartId,
        paymentMethod,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        cart: {
          include: {
            items: {
              include: {
                coffee: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: {
        cart: {
          userId,
        },
      },
      include: {
        cart: {
          include: {
            items: {
              include: {
                coffee: true,
              },
            },
          },
        },
      },
    });
  }
}
