import { IsInt, IsNotEmpty } from 'class-validator';

export class AddNewCardDetailsDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  expiry: string;

  @IsNotEmpty()
  lastDigits: string;
}

export class UpdateCardStatusDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  cardId: string;
}
