import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
  private prisma = new PrismaClient();

  private readonly addressObj = {
    address: true,
    address_id: true,
    city: true,
    country: true,
    isActive: true,
    pincode: true,
    state: true,
  };

  async createAddress(userId: number, createAddressPayload: CreateAddressDto) {
    try {
      await this.prisma.address.create({
        data: {
          user_id: userId,
          ...createAddressPayload,
        },
      });

      return {
        message: 'Address added successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getUserAddresses(userId: number) {
    return this.prisma.address.findMany({
      where: { user_id: userId },
      select: this.addressObj,
    });
  }
}
