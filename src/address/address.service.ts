import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAddressDto, ToggleAddressStatusDto } from './dto/address.dto';

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

  async updateAddressStatus(
    toggleAddressStatusPayload: ToggleAddressStatusDto,
  ) {
    const { userId, addressId } = toggleAddressStatusPayload;
    try {
      const address = await this.prisma.address.findUnique({
        where: { address_id: addressId },
      });

      if (!address) {
        throw new ConflictException('Address not found');
      }

      if (address.user_id !== userId) {
        throw new ConflictException('Address does not belong to this user');
      }

      const newStatus = !address.isActive;

      if (newStatus) {
        await this.prisma.address.updateMany({
          where: { user_id: userId },
          data: { isActive: false },
        });
      }

      await this.prisma.address.update({
        where: { address_id: addressId },
        data: { isActive: newStatus },
      });

      return {
        message: 'Address status updated successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to update address status: ${error.message}`);
    }
  }
}
