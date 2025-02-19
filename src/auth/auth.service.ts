import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  CreateNewUserDto,
  LoginWithEmailDto,
  UpdateUserNameDto,
} from './dto/auth.dto';

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

      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password_hash,
        },
      });

      const token = this.jwtService.sign({ email, name });

      return {
        message: 'User created successfully',
        token,
        userData: {
          email,
          name,
          user_id: newUser.user_id,
        },
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

    const name = existingUser.name;
    const user_id = existingUser.user_id;

    const token = this.jwtService.sign({ email, name });

    return {
      message: 'Welcome! You’ve successfully logged in',
      token,
      userData: {
        email,
        name,
        user_id,
      },
    };
  }

  async updateUserName(updateUserNamePayload: UpdateUserNameDto) {
    try {
      const { name, email } = updateUserNamePayload;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new ConflictException('User does not exists');
      }

      await this.prisma.user.update({
        where: { email },
        data: {
          name,
        },
      });

      return {
        message: 'Username changed successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          message: 'Failed to change username. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
