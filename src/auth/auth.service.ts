import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateNewUserDto, LoginWithEmailDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private prisma = new PrismaClient();

  // to create a user
  async createNewUser(createNewUserPayload: CreateNewUserDto) {
    try {
      const { email, name, password } = createNewUserPayload;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email is taken');
      }

      const password_hash = await bcrypt.hash(password, 10);

      await this.prisma.user.create({
        data: {
          name,
          email,
          password_hash,
        },
      });

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
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
