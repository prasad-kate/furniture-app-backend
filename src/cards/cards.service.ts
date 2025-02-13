import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddNewCardDetailsDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  private prisma = new PrismaClient();
  private readonly cardsObj = {
    card_id: true,
    expiry: true,
    isActive: true,
    lastDigits: true,
    userName: true,
  };

  async getCardDetailsFromUserId(user_id: number) {
    try {
      const cardDetails = await this.prisma.card.findMany({
        where: { userId: user_id },
        select: this.cardsObj,
      });

      if (!cardDetails?.length) {
        throw new ConflictException('Card details not found');
      }

      return cardDetails;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async addNewCardDetails(addNewCardDetailsPayload: AddNewCardDetailsDto) {
    const { userId, userName, lastDigits, expiry } = addNewCardDetailsPayload;

    try {
      await this.prisma.card.create({
        data: {
          userId,
          userName,
          lastDigits,
          expiry,
          isActive: false,
        },
      });

      return {
        message: 'Card details added successfully',
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
