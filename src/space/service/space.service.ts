import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Web3Storage, File } from 'web3.storage';
import { CreateSpaceDto } from '../dto/createSpace.dto';
import { CreateItemDto } from '../dto/createItem.dto';
import { CreateItemFromFileDto } from '../dto/createItemFromFile.dto';
import { UpdateItemDto } from '../dto/updateItem.dto';
import { SpaceEntity } from '../entity/space.entity';
import { ItemEntity } from '../entity/item.entity';
import { SpaceExistsException } from '../exception/spaceExists.exception';
import { ItemExistsException } from '../exception/itemExists.exception';
import { ItemNotFoundException } from '../exception/itemNotFound.exception';
import { SpaceNotFoundException } from '../exception/spaceNotFound.exception';
import { NotAuthorizedException } from '../exception/notAuthorized.exception';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceEntity)
    private readonly spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async createSpace(space: CreateSpaceDto): Promise<SpaceEntity> {
    const checkSpace = await this.spaceRepository.findOne({
      where: { owner: space.owner },
    });
    if (checkSpace) {
      throw new SpaceExistsException();
    }
    return this.spaceRepository.save(space);
  }

  private dataUriToBuffer(dataUri: string) {
    return Buffer.from(dataUri.split(',')[1], 'base64');
  }

  public async uploadToIpfs(
    createItemFromFile: CreateItemFromFileDto,
  ): Promise<CreateItemDto> {
    const buffer = this.dataUriToBuffer(createItemFromFile.file);
    const filenameWithExtension =
      createItemFromFile.filename + '.' + createItemFromFile.fileExtension;
    const file = new File([buffer], filenameWithExtension);
    const cid = await this.storeFiles(file);
    return {
      source: createItemFromFile.source,
      content: cid + '/' + filenameWithExtension,
      category: createItemFromFile.category,
      metadata: createItemFromFile.metadata,
    };
  }

  private async storeFiles(file: File): Promise<string> {
    const client = new Web3Storage({
      token: this.configService.get('WEB3STORAGE_TOKEN'),
    });
    const cid = await client.put([file], { wrapWithDirectory: true });
    return cid;
  }

  public async createItem(
    createItem: CreateItemDto,
    owner: string,
  ): Promise<ItemEntity> {
    const space = await this.findSpaceByOwner(owner);
    const content = createItem.content;
    const item = await this.itemRepository.findOne({
      where: {
        content,
        space,
      },
    });
    if (item) {
      throw new ItemExistsException();
    }

    const newItem = this.itemRepository.create({
      ...createItem,
      space,
    });

    return await this.itemRepository.save(newItem);
  }

  public async findItem(
    id: string,
    withRelations?: boolean,
  ): Promise<ItemEntity> {
    const properties = { where: { id } };
    if (withRelations) {
      properties['relations'] = ['space'];
    }
    const item = await this.itemRepository.findOne(properties);
    if (!item) {
      throw new ItemNotFoundException();
    }
    return item;
  }

  public async findSpace(
    id: string,
    withRelations?: boolean,
  ): Promise<SpaceEntity> {
    const properties = { where: { id } };
    if (withRelations) {
      properties['relations'] = ['items'];
    }
    const space = await this.spaceRepository.findOne({
      where: { id },
      ...properties,
    });
    if (!space) {
      throw new SpaceNotFoundException();
    }
    return space;
  }

  public async findSpaceByOwner(
    owner: string,
    withRelations?: boolean,
  ): Promise<SpaceEntity> {
    const properties = { where: { owner } };
    if (withRelations) {
      properties['relations'] = ['items'];
    }
    const space = await this.spaceRepository.findOne(properties);
    if (!space) {
      throw new SpaceNotFoundException();
    }
    return space;
  }

  public async deleteItem(itemId: string, owner: string): Promise<ItemEntity> {
    const item = await this.findItem(itemId, true);
    const space = await this.findSpaceByOwner(owner);
    if (item.space.id != space.id) {
      throw new NotAuthorizedException();
    }
    await this.itemRepository.delete({ id: itemId });
    return item;
  }

  public async updateItem(
    updateItem: UpdateItemDto,
    itemId: string,
    owner: string,
  ): Promise<ItemEntity> {
    const space = await this.findSpaceByOwner(owner);
    const item = await this.findItem(itemId, true);

    if (item.space.id != space.id) {
      throw new NotAuthorizedException();
    }

    await this.itemRepository.update(
      {
        id: itemId,
      },
      updateItem,
    );

    return await this.findItem(itemId, true);
  }
}
