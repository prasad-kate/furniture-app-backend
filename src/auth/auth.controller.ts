import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateNewUserDto,
  LoginWithEmailDto,
  UpdateUserNameDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user')
  createNewUser(@Body() createNewUserPayload: CreateNewUserDto) {
    return this.authService.createNewUser(createNewUserPayload);
  }

  @Post('login')
  @HttpCode(200)
  loginWithEmail(@Body() loginEmailAndPassword: LoginWithEmailDto) {
    return this.authService.loginWithEmail(loginEmailAndPassword);
  }

  @Patch('user/update_name')
  async updateUserName(@Body() updateUserNamePayload: UpdateUserNameDto) {
    return this.authService.updateUserName(updateUserNamePayload);
  }
}
