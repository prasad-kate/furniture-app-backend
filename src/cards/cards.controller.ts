import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AddNewCardDetailsDto } from './dto/card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':user_id')
  getCardDetailsFromUserId(@Param('user_id') user_id: number) {
    return this.cardsService.getCardDetailsFromUserId(Number(user_id));
  }

  @Post('create')
  addNewCardDetails(@Body() addNewCardDetailsPayload: AddNewCardDetailsDto) {
    return this.cardsService.addNewCardDetails(addNewCardDetailsPayload);
  }
}
