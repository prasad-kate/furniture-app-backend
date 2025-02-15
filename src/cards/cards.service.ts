import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddNewCardDetailsDto, UpdateCardStatusDto } from './dto/card.dto';

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

  async updateCardStatus(toggleCardStatusPayload: UpdateCardStatusDto) {
    const { userId, cardId } = toggleCardStatusPayload;

    try {
      const cardDetails = await this.prisma.card.findUnique({
        where: { card_id: cardId },
      });

      if (!cardDetails) {
        throw new ConflictException('Card details not found');
      }

      if (cardDetails.userId !== userId) {
        throw new ConflictException('Card does not belong to this user');
      }

      const newStatus = !cardDetails?.isActive;

      if (newStatus) {
        await this.prisma.card.updateMany({
          where: { userId },
          data: { isActive: false },
        });
      }

      await this.prisma.card.update({
        where: { card_id: cardId },
        data: { isActive: newStatus },
      });

      return {
        message: 'Card status updated successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to update card status: ${error.message}`);
    }
  }
}
