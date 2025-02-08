import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, ToggleAddressStatusDto } from './dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':userId')
  async createAddress(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressService.createAddress(userId, dto);
  }

  @Get(':userId')
  async getUserAddresses(@Param('userId', ParseIntPipe) userId: number) {
    return this.addressService.getUserAddresses(userId);
  }

  @Patch('update_status')
  async toggleAddressStatus(
    @Body() toggleAddressStatusPayload: ToggleAddressStatusDto,
  ) {
    return this.addressService.updateAddressStatus(toggleAddressStatusPayload);
  }
}
