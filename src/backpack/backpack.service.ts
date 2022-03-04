import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateBackpackDto } from './dto/createBackpack.dto';
import { BackpackEntity } from './entities/backpack.entity';

@Injectable()
export class BackpackService {
  constructor(
    @InjectRepository(BackpackEntity)
    private backpackRepository: Repository<BackpackEntity>,
  ) {}

  create(backpack: CreateBackpackDto): Promise<BackpackEntity> {
    return this.backpackRepository.save(backpack);
  }

  findOne(id: string): Promise<BackpackEntity> {
    return this.backpackRepository.findOne(id, {
      relations: ['backpackItems'],
    });
  }
}
