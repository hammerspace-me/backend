import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BackpackController } from './controller/backpack.controller';
import { BackpackEntity } from './entity/backpack.entity';

import { BackpackItemEntity } from './entity/backpackItem.entity';
import { BackpackService } from './service/backpack.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackpackEntity, BackpackItemEntity]),
    ConfigModule,
  ],
  controllers: [BackpackController],
  providers: [BackpackService],
  exports: [BackpackService],
})
export class BackpackModule {}
