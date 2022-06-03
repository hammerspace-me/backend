import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Web3Storage, File } from 'web3.storage';
import { CreateBackpackDto } from '../dto/createBackpack.dto';
import { CreateBackpackItemDto } from '../dto/createBackpackItem.dto';
import { CreateBackpackItemFromFileDto } from '../dto/createBackpackItemFromFile.dto';
import { UpdateBackpackItemDto } from '../dto/updateBackpackItem.dto';
import { BackpackEntity } from '../entity/backpack.entity';
import { BackpackItemEntity } from '../entity/backpackItem.entity';
import { BackpackExistsException } from '../exception/backpackExists.exception';
import { BackpackItemExistsException } from '../exception/backpackItemExists.exception';
import { BackpackItemNotFoundException } from '../exception/backpackItemNotFound.exception';
import { BackpackNotFoundException } from '../exception/backpackNotFound.exception';
import { NotAuthorizedException } from '../exception/notAuthorized.exception';

@Injectable()
export class BackpackService {
  constructor(
    @InjectRepository(BackpackEntity)
    private readonly backpackRepository: Repository<BackpackEntity>,
    @InjectRepository(BackpackItemEntity)
    private readonly backpackItemRepository: Repository<BackpackItemEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async createBackpack(
    backpack: CreateBackpackDto,
  ): Promise<BackpackEntity> {
    const checkBackpack = await this.backpackRepository.findOne({
      where: { owner: backpack.owner },
    });
    if (checkBackpack) {
      throw new BackpackExistsException();
    }
    return this.backpackRepository.save(backpack);
  }

  private dataUriToBuffer(dataUri: string) {
    return Buffer.from(dataUri.split(',')[1], 'base64');
  }

  public async uploadToIpfs(
    createBackpackItemFromFile: CreateBackpackItemFromFileDto,
  ): Promise<CreateBackpackItemDto> {
    const buffer = this.dataUriToBuffer(createBackpackItemFromFile.file);
    const filenameWithExtension =
      createBackpackItemFromFile.filename +
      '.' +
      createBackpackItemFromFile.fileExtension;
    const file = new File([buffer], filenameWithExtension);
    const cid = await this.storeFiles(file);
    return {
      source: createBackpackItemFromFile.source,
      content: cid + '/' + filenameWithExtension,
      category: createBackpackItemFromFile.category,
      metadata: createBackpackItemFromFile.metadata,
    };
  }

  private async storeFiles(file: File): Promise<string> {
    const client = new Web3Storage({
      token: this.configService.get('WEB3STORAGE_TOKEN'),
    });
    const cid = await client.put([file], { wrapWithDirectory: true });
    return cid;
  }

  public async createBackpackItem(
    createBackpackItem: CreateBackpackItemDto,
    owner: string,
  ): Promise<BackpackItemEntity> {
    const backpack = await this.findBackpackByOwner(owner);
    const content = createBackpackItem.content;
    const backpackItem = await this.backpackItemRepository.findOne({
      where: {
        content,
        backpack,
      },
    });
    if (backpackItem) {
      throw new BackpackItemExistsException();
    }

    const newBackpackItem = this.backpackItemRepository.create({
      ...createBackpackItem,
      backpack,
    });

    return await this.backpackItemRepository.save(newBackpackItem);
  }

  public async findBackpackItem(
    id: string,
    withRelations?: boolean,
  ): Promise<BackpackItemEntity> {
    const properties = { where: { id } };
    if (withRelations) {
      properties['relations'] = ['backpack'];
    }
    const backpackItem = await this.backpackItemRepository.findOne(properties);
    if (!backpackItem) {
      throw new BackpackItemNotFoundException();
    }
    return backpackItem;
  }

  public async findBackpack(
    id: string,
    withRelations?: boolean,
  ): Promise<BackpackEntity> {
    const properties: object = withRelations
      ? {
          relations: ['backpackItems'],
        }
      : null;
    const backpack = await this.backpackRepository.findOne(id, properties);
    if (!backpack) {
      throw new BackpackNotFoundException();
    }
    return backpack;
  }

  public async findBackpackByOwner(
    owner: string,
    withRelations?: boolean,
  ): Promise<BackpackEntity> {
    const properties = { where: { owner } };
    if (withRelations) {
      properties['relations'] = ['backpackItems'];
    }
    const backpack = await this.backpackRepository.findOne(properties);
    if (!backpack) {
      throw new BackpackNotFoundException();
    }
    return backpack;
  }

  public async deleteBackpackItem(
    backpackItemId: string,
    owner: string,
  ): Promise<BackpackItemEntity> {
    const backpackItem = await this.findBackpackItem(backpackItemId, true);
    const backpack = await this.findBackpackByOwner(owner);
    if (backpackItem.backpack.id != backpack.id) {
      throw new NotAuthorizedException();
    }
    await this.backpackItemRepository.delete({ id: backpackItemId });
    return backpackItem;
  }

  public async updateBackpackItem(
    updateBackpackItem: UpdateBackpackItemDto,
    backpackItemId: string,
    owner: string,
  ): Promise<BackpackItemEntity> {
    const backpack = await this.findBackpackByOwner(owner);
    const backpackItem = await this.findBackpackItem(backpackItemId, true);

    if (backpackItem.backpack.id != backpack.id) {
      throw new NotAuthorizedException();
    }

    await this.backpackItemRepository.update(
      {
        id: backpackItemId,
      },
      {
        source: updateBackpackItem.source,
        category: updateBackpackItem.category,
        metadata: updateBackpackItem.metadata,
      },
    );

    return await this.findBackpackItem(backpackItemId, true);
  }
}
