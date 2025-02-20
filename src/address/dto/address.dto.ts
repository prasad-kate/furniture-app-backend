import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;
}

export class ToggleAddressStatusDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  addressId: number;
}

export class DeleteAddressDto {
  @IsInt()
  @IsNotEmpty()
  address_id: number;
}
