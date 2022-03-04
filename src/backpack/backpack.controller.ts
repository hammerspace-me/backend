import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Logger,
  HttpStatus,
  Res,
  UsePipes,
  Body,
  ValidationPipe,
  ConflictException,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateBackpackDto } from './dto/createBackpack.dto';
import { BackpackItemEntity } from './entities/backpackItem.entity';
import { BackpackService } from './backpack.service';

@Controller('backpack')
export class BackpackController {
  private readonly logger = new Logger(BackpackController.name);

  constructor(private readonly backpackService: BackpackService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Backpack has been succesfully presented',
  })
  @ApiResponse({
    status: 404,
    description: 'Backpack could not been found',
  })
  public async getbackpack(@Res() res: Response, @Param('id') id: string) {
    const backpack = await this.backpackService.findOne(id);
    if (!backpack) {
      throw new NotFoundException(
        'Backpack could not be found in the database',
        'USER_NOT_FOUND',
      );
    }
    return res.status(HttpStatus.OK).json(backpack);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Backpack has been successfully created',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createBackpack(
    @Res() res: Response,
    @Body() createBackpackDto: CreateBackpackDto,
  ) {
    const backpack = await this.backpackService.findOne(createBackpackDto.id);
    if (backpack) {
      throw new ConflictException('Backpack already exists', 'USER_EXISTS');
    }
    const createdBackpack = await this.backpackService.create(
      createBackpackDto,
    );
    return res.status(HttpStatus.CREATED).json(createdBackpack);
  }
}
