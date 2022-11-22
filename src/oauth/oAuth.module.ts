import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ActivationRequestEntity from './entity/activationRequest.entity';
import ApplicationEntity from './entity/application.entity';
import AuthorizationRequestEntity from './entity/authorizationRequest.entity';
import OAuthController from './controller/oAuth.controller';
import { OAuthService } from './service/oAuth.service';
import { SpaceModule } from 'src/space/space.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivationRequestEntity,
      ApplicationEntity,
      AuthorizationRequestEntity,
    ]),
    ConfigModule,
    SpaceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [],
})
export class OAuthModule {}
