import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BackpackModule } from './backpack/backpack.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config: any = {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: +configService.get<number>('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USERNAME'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };

        if (configService.get('POSTGRES_SSL') == 'true') {
          config['ssl'] = { rejectUnauthorized: false };
        }

        return config;
      },
      inject: [ConfigService],
    }),
    BackpackModule,
    AuthModule,
  ],
})
export class AppModule {}
