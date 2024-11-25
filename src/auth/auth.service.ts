import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateNewUserDto, LoginWithEmailDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // to create a user
  createNewUser(createNewUserPayload: CreateNewUserDto) {
    const { email, name } = createNewUserPayload;
    return {
      message: 'User created succesfully',
      email,
      name,
    };
  }

  // to login user with email and password
  loginWithEmail(loginEmailAndPassword: LoginWithEmailDto) {
    const email = loginEmailAndPassword.email;

    const token = this.jwtService.sign({ email });

    return {
      message: 'User logged-in successfully',
      token,
    };
  }
}
