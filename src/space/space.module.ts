import { Module } from '@nestjs/common';
import { SpaceService } from './service/space.service';
import { SpaceController } from './controller/space.controller';
import { SpaceEntity } from './entity/space.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './entity/item.entity';
import { ConfigModule } from '@nestjs/config';
import { ItemController } from './controller/item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceEntity, ItemEntity]), ConfigModule],
  controllers: [SpaceController, ItemController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
