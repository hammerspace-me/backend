import { Module } from '@nestjs/common';
import { BackpackService } from './service/backpack.service';
import { BackpackController } from './controller/backpack.controller';
import { BackpackEntity } from './entity/backpack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackpackItemEntity } from './entity/backpackItem.entity';
import { ConfigModule } from '@nestjs/config';

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
