import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModule } from './space/space.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OAuthModule } from './oauth/oAuth.module';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(__dirname);
        let config: DataSourceOptions = {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: +configService.get<number>('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USERNAME'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          migrationsRun: true,
          logging: true,
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          ssl:
            configService.get('POSTGRES_SSL') == 'true'
              ? { rejectUnauthorized: false }
              : null,
        };

        return config;
      },
      inject: [ConfigService],
    }),
    SpaceModule,
    AuthModule,
    OAuthModule,
  ],
})
export class AppModule {}
