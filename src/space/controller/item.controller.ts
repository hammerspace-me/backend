import {
  Controller,
  Get,
  Param,
  Logger,
  Body,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SpaceService } from '../service/space.service';
import { CreateItemDto } from '../dto/createItem.dto';
import { JwtAuthGuard } from '../../auth/guard/jwtAuth.guard';
import { UpdateItemDto } from '../dto/updateItem.dto';
import { CreateItemFromFileDto } from '../dto/createItemFromFile.dto';
import { ItemSuccessApiResponse } from 'src/docs/responses/successApiResponse.decorator';
import { EndpointMethod } from 'src/docs/responses/endpointMethod.enum';
import { ItemNotFoundApiResponse } from 'src/docs/responses/notFoundApiResponse.decorator';
import { ValidationFailedApiResponse } from 'src/docs/responses/validationApiResponse.decorator';
import { ItemExistsApiResponse } from 'src/docs/responses/existsApiResponse.decorator';
import { ServerErrorApiResponse } from 'src/docs/responses/serverErrorResponse.decorator';
import { UnauthorizedApiResponse } from 'src/docs/responses/authResponse.decorator';

@Controller('item')
@ApiBearerAuth()
@ServerErrorApiResponse()
@UnauthorizedApiResponse()
export class ItemController {
  private readonly logger = new Logger(ItemController.name);
  constructor(private readonly spaceService: SpaceService) {}

  @Get(':id')
  @ItemSuccessApiResponse(EndpointMethod.READ)
  @ItemNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description: 'Retrieve a specific item associated to the provided id.',
  })
  public async getItem(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.spaceService.findItem(id, true);
    return item;
  }

  @Post()
  @ItemSuccessApiResponse(EndpointMethod.CREATE)
  @ItemExistsApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description:
      'Create a new item associated to the space of the logged in user.',
  })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  public async createItem(
    @Request() req,
    @Body() createItemDto: CreateItemDto,
  ) {
    const createdItem = await this.spaceService.createItem(
      createItemDto,
      req.user.address,
    );
    return createdItem;
  }

  @Post('/file')
  @HttpCode(201)
  @ItemSuccessApiResponse(EndpointMethod.CREATE)
  @ItemExistsApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description:
      'Create a new item associated to the space of the logged in user by providing the file contents as base64.',
  })
  @UseGuards(JwtAuthGuard)
  public async createItemFromFile(
    @Request() req,
    @Body() createItemFromFileDto: CreateItemFromFileDto,
  ) {
    const createItemDto = await this.spaceService.uploadToIpfs(
      createItemFromFileDto,
    );
    const createdItem = await this.spaceService.createItem(
      createItemDto,
      req.user.address,
    );
    return createdItem;
  }

  @Delete(':id')
  @ItemSuccessApiResponse(EndpointMethod.DELETE)
  @ItemNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description: 'Delete a specific item associated to the provided id.',
  })
  @UseGuards(JwtAuthGuard)
  public async deleteItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const item = await this.spaceService.deleteItem(id, req.user.address);
    return item;
  }

  @Post(':id')
  @ItemSuccessApiResponse(EndpointMethod.UPDATE)
  @ItemNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description: 'Update a specific item associated to the provided id.',
  })
  @UseGuards(JwtAuthGuard)
  public async updateItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const item = await this.spaceService.updateItem(
      updateItemDto,
      id,
      req.user.address,
    );
    return item;
  }
}
