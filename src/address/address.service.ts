import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
  private prisma = new PrismaClient();

  async createAddress(userId: number, createAddressPayload: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        user_id: userId,
        ...createAddressPayload,
      },
    });
  }
}
