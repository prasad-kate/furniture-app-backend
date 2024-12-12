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
  async loginWithEmail(loginEmailAndPassword: LoginWithEmailDto) {
    const { email, password } = loginEmailAndPassword;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new ConflictException(
        'No account is associated with this email address',
      );
    }

    const savedPasswordHash = existingUser.password_hash;

    const isMatchingPassword = await bcrypt.compare(
      password,
      savedPasswordHash,
    );

    if (!isMatchingPassword) {
      throw new ConflictException(
        'Incorrect password for associated email address',
      );
    }

    const token = this.jwtService.sign({ email });

    return {
      message: 'Welcome! You’ve successfully logged in',
      token,
    };
  }
}
