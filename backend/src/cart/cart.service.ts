import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart() {
    const cart = await this.prisma.cart.create({
      data: {
        status: 'AGUARDANDO_PAGAMENTO',
        statusPayment: 'PENDENTE',
      },
    });
    return cart;
  }

  async getCart(id: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            coffee: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) throw new NotFoundException('Carrinho não encontrado');

    return cart;
  }

  async addItem(cartId: string, dto: AddItemDto) {
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) throw new NotFoundException('Carrinho não encontrado');

    const coffee = await this.prisma.coffee.findUnique({ where: { id: dto.coffeeId } });
    if (!coffee) throw new NotFoundException('Café não encontrado');

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        coffeeId: dto.coffeeId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + dto.quantity,
          updatedAt: new Date(),
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        coffeeId: dto.coffeeId,
        quantity: dto.quantity,
        unitPrice: new Decimal(coffee.price.toString()),
      },
    });
  }

  async removeItem(cartId: string, coffeeId: string) {
  const item = await this.prisma.cartItem.findFirst({
    where: {
      cartId,
      coffeeId,
    },
  });

  if (!item) throw new NotFoundException('Item não encontrado no carrinho');

  return this.prisma.cartItem.delete({
    where: { id: item.id },
  });
}
}
