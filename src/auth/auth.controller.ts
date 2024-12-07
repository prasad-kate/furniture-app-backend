import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateNewUserDto, LoginWithEmailDto } from './dto/auth.dto';

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
}
