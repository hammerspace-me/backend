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
    const checkBackpack = await this.backpackRepository.findOne(backpack.id);
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
    // TODO: change to generalized form, not just RPM avatars
    const fileName = 'default.glb';
    const file = new File([buffer], fileName);
    const cid = await this.storeFiles(file);
    return {
      source: createBackpackItemFromFile.source,
      content: cid,
      category: createBackpackItemFromFile.category,
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
    backpackId: string,
  ): Promise<BackpackItemEntity> {
    const backpack = await this.findBackpack(backpackId);
    const content = createBackpackItem.content;
    const backpackItem = await this.backpackItemRepository.findOne({
      content,
      backpack,
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
    content: string,
    backpack: BackpackEntity,
    withRelations?: boolean,
  ): Promise<BackpackItemEntity> {
    // TODO: decide whether backpack items with same CID can belong to multiple backpacks (FK either content or backpack and content)
    const properties = { where: { content, backpack } };
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

  public async deleteBackpackItem(
    content: string,
    backpackId: string,
  ): Promise<BackpackItemEntity> {
    const backpack = await this.findBackpack(backpackId);
    const backpackItem = await this.findBackpackItem(content, backpack, true);
    if (backpackItem.backpack.id != backpackId) {
      throw new NotAuthorizedException();
    }
    await this.backpackItemRepository.delete({ content, backpack });
    return backpackItem;
  }

  public async updateBackpackItem(
    updateBackpackItem: UpdateBackpackItemDto,
    backpackItemId: string,
    backpackId: string,
  ): Promise<BackpackItemEntity> {
    const backpack = await this.findBackpack(backpackId);
    const backpackItem = await this.findBackpackItem(
      backpackItemId,
      backpack,
      true,
    );

    if (backpackItem.backpack.id != backpackId) {
      throw new NotAuthorizedException();
    }

    await this.backpackItemRepository.update(
      {
        content: backpackItem.content,
        backpack: backpack,
      },
      {
        source: updateBackpackItem.source,
        category: updateBackpackItem.category,
      },
    );

    return await this.findBackpackItem(backpackItemId, backpack, true);
  }
}
