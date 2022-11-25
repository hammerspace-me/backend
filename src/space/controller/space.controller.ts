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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateSpaceDto } from '../dto/createSpace.dto';
import { SpaceService } from '../service/space.service';
import { JwtAuthGuard } from '../../auth/guard/jwtAuth.guard';
import { SpaceSuccessApiResponse } from 'src/docs/responses/successApiResponse.decorator';
import { EndpointMethod } from 'src/docs/responses/endpointMethod.enum';
import { SpaceNotFoundApiResponse } from 'src/docs/responses/notFoundApiResponse.decorator';
import { ValidationFailedApiResponse } from 'src/docs/responses/validationApiResponse.decorator';
import { SpaceExistsApiResponse } from 'src/docs/responses/existsApiResponse.decorator';
import { ServerErrorApiResponse } from 'src/docs/responses/serverErrorResponse.decorator';
import { UnauthorizedApiResponse } from 'src/docs/responses/authResponse.decorator';

@Controller('space')
@ApiBearerAuth()
@ServerErrorApiResponse()
@UnauthorizedApiResponse()
export class SpaceController {
  private readonly logger = new Logger(SpaceController.name);
  constructor(private readonly spaceService: SpaceService) {}

  @Get('/owner')
  @UseGuards(JwtAuthGuard)
  @SpaceSuccessApiResponse(EndpointMethod.READ)
  @SpaceNotFoundApiResponse()
  @ApiOperation({
    description: 'Retrieve the space associated to the logged in user.',
  })
  public async getSpaceByOwner(@Request() req) {
    const space = await this.spaceService.findSpaceByOwner(
      req.user.address,
      true,
    );
    return space;
  }

  @Get(':id')
  @SpaceSuccessApiResponse(EndpointMethod.READ)
  @SpaceNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description: 'Retrieve a specific space associated to the provided id.',
  })
  public async getSpace(@Param('id', ParseUUIDPipe) id: string) {
    const space = await this.spaceService.findSpace(id, true);
    return space;
  }

  @Post()
  @SpaceSuccessApiResponse(EndpointMethod.CREATE)
  @SpaceExistsApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description: 'Create a new space associated to the logged in user.',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    const createdSpace = await this.spaceService.createSpace(createSpaceDto);
    return createdSpace;
  }
}
