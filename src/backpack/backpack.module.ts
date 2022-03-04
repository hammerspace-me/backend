import { Module } from '@nestjs/common';
import { BackpackService } from './backpack.service';
import { BackpackController } from './backpack.controller';
import { BackpackEntity } from './entities/backpack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BackpackEntity])],
  controllers: [BackpackController],
  providers: [BackpackService],
})
export class BackpackModule {}
