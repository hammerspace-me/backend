import {
  Controller,
  Get,
  Param,
  Logger,
  UsePipes,
  Body,
  ValidationPipe,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateBackpackDto } from '../dto/createBackpack.dto';
import { BackpackService } from '../service/backpack.service';
import { CreateBackpackItemDto } from '../dto/createBackpackItem.dto';
import { JwtAuthGuard } from '../../auth/guard/jwtAuth.guard';
import { UpdateBackpackItemDto } from '../dto/updateBackpackItem.dto';
import { CreateBackpackItemFromFileDto } from '../dto/createBackpackItemFromFile.dto';

@Controller('backpack')
export class BackpackController {
  private readonly logger = new Logger(BackpackController.name);
  constructor(private readonly backpackService: BackpackService) {}

  @Get('/owner')
  @ApiResponse({
    status: 200,
    description: 'Backpack has been presented successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Backpack could not been found',
  })
  @UseGuards(JwtAuthGuard)
  public async getBackpackByOwner(@Request() req) {
    const backpack = await this.backpackService.findBackpackByOwner(
      req.user.address,
      true,
    );
    return backpack;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Backpack has been presented successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Backpack could not been found',
  })
  public async getBackpack(@Param('id', ParseUUIDPipe) id: string) {
    const backpack = await this.backpackService.findBackpack(id, true);
    return backpack;
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Backpack has been created successfully',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createBackpack(@Body() createBackpackDto: CreateBackpackDto) {
    const createdBackpack = await this.backpackService.createBackpack(
      createBackpackDto,
    );
    return createdBackpack;
  }

  @Post('/item')
  @ApiResponse({
    status: 201,
    description: 'Backpack item has been created successfully',
  })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  public async createBackpackItem(
    @Request() req,
    @Body() createBackpackItemDto: CreateBackpackItemDto,
  ) {
    const createdBackpackItem = await this.backpackService.createBackpackItem(
      createBackpackItemDto,
      req.user.address,
    );
    return createdBackpackItem;
  }

  @Post('/item/file')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  public async createBackpackItemFromFile(
    @Request() req,
    @Body() createBackpackItemFromFileDto: CreateBackpackItemFromFileDto,
  ) {
    const createBackpackItemDto = await this.backpackService.uploadToIpfs(
      createBackpackItemFromFileDto,
    );
    const createdBackpackItem = await this.backpackService.createBackpackItem(
      createBackpackItemDto,
      req.user.address,
    );
    return createdBackpackItem;
  }

  @Delete('/item/:id')
  @ApiResponse({
    status: 200,
    description: 'Backpack item has been deleted successfully',
  })
  @UseGuards(JwtAuthGuard)
  public async deleteBackpackItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const backpackItem = await this.backpackService.deleteBackpackItem(
      id,
      req.user.address,
    );
    return backpackItem;
  }

  @Post('/item/:id')
  @ApiResponse({
    status: 200,
    description: 'Backpack item has been updated successfully',
  })
  @UseGuards(JwtAuthGuard)
  public async updateBackpackItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBackpackItemDto: UpdateBackpackItemDto,
  ) {
    const backpackItem = await this.backpackService.updateBackpackItem(
      updateBackpackItemDto,
      id,
      req.user.address,
    );
    return backpackItem;
  }
}
