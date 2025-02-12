import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TokenExpiryMiddleware } from './middlewares/token.expiry';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { AddressModule } from './address/address.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    AddressModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(tokenExpiry: MiddlewareConsumer) {
    tokenExpiry
      .apply(TokenExpiryMiddleware)
      .exclude('auth/login', 'auth/user')
      .forRoutes('*');
  }
}
