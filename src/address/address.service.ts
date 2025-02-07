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
}
