import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AddNewCardDetailsDto, UpdateCardStatusDto } from './dto/card.dto';

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

  @Patch('update_status')
  async updateCardStatus(@Body() toggleCardStatusPayload: UpdateCardStatusDto) {
    return this.cardsService.updateCardStatus(toggleCardStatusPayload);
  }
}
