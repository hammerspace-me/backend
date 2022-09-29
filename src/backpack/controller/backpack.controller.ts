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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateBackpackDto } from '../dto/createBackpack.dto';
import { BackpackService } from '../service/backpack.service';
import { CreateBackpackItemDto } from '../dto/createBackpackItem.dto';
import { JwtAuthGuard } from '../../auth/guard/jwtAuth.guard';
import { UpdateBackpackItemDto } from '../dto/updateBackpackItem.dto';
import { CreateBackpackItemFromFileDto } from '../dto/createBackpackItemFromFile.dto';
import {
  BackpackItemSuccessApiResponse,
  BackpackSuccessApiResponse,
} from 'src/docs/responses/successApiResponse.decorator';
import { EndpointMethod } from 'src/docs/responses/endpointMethod.enum';
import {
  BackpackItemNotFoundApiResponse,
  BackpackNotFoundApiResponse,
} from 'src/docs/responses/notFoundApiResponse.decorator';
import { ValidationFailedApiResponse } from 'src/docs/responses/validationApiResponse.decorator';
import {
  BackpackExistsApiResponse,
  BackpackItemExistsApiResponse,
} from 'src/docs/responses/existsApiResponse.decorator';
import { ServerErrorApiResponse } from 'src/docs/responses/serverErrorResponse.decorator';
import { UnauthorizedApiResponse } from 'src/docs/responses/authResponse.decorator';

@Controller('backpack')
@ApiBearerAuth()
@ServerErrorApiResponse()
@UnauthorizedApiResponse()
export class BackpackController {
  private readonly logger = new Logger(BackpackController.name);
  constructor(private readonly backpackService: BackpackService) {}

  @Get('/owner')
  @UseGuards(JwtAuthGuard)
  @BackpackSuccessApiResponse(EndpointMethod.READ)
  @BackpackNotFoundApiResponse()
  public async getBackpackByOwner(@Request() req) {
    const backpack = await this.backpackService.findBackpackByOwner(
      req.user.address,
      true,
    );
    return backpack;
  }

  @Get(':id')
  @BackpackSuccessApiResponse(EndpointMethod.READ)
  @BackpackNotFoundApiResponse()
  @ValidationFailedApiResponse()
  public async getBackpack(@Param('id', ParseUUIDPipe) id: string) {
    const backpack = await this.backpackService.findBackpack(id, true);
    return backpack;
  }

  @Get('item/:id')
  @BackpackItemSuccessApiResponse(EndpointMethod.READ)
  @BackpackItemNotFoundApiResponse()
  @ValidationFailedApiResponse()
  public async getBackpackItem(@Param('id', ParseUUIDPipe) id: string) {
    const backpackItem = await this.backpackService.findBackpackItem(id, true);
    return backpackItem;
  }

  @Post()
  @BackpackSuccessApiResponse(EndpointMethod.CREATE)
  @BackpackExistsApiResponse()
  @ValidationFailedApiResponse()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createBackpack(@Body() createBackpackDto: CreateBackpackDto) {
    const createdBackpack = await this.backpackService.createBackpack(
      createBackpackDto,
    );
    return createdBackpack;
  }

  @Post('/item')
  @BackpackItemSuccessApiResponse(EndpointMethod.CREATE)
  @BackpackItemExistsApiResponse()
  @ValidationFailedApiResponse()
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
  @BackpackItemSuccessApiResponse(EndpointMethod.CREATE)
  @BackpackItemExistsApiResponse()
  @ValidationFailedApiResponse()
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
  @BackpackItemSuccessApiResponse(EndpointMethod.DELETE)
  @BackpackItemNotFoundApiResponse()
  @ValidationFailedApiResponse()
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
  @BackpackItemSuccessApiResponse(EndpointMethod.UPDATE)
  @BackpackItemNotFoundApiResponse()
  @ValidationFailedApiResponse()
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
