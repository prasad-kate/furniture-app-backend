import { Controller, Get, Param } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':user_id')
  getCardDetailsFromUserId(@Param('user_id') user_id: number) {
    return this.cardsService.getCardDetailsFromUserId(Number(user_id));
  }
}
