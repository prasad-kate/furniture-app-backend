import { IsNotEmpty } from 'class-validator';

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
