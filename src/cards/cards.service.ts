import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
}
