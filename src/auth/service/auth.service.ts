import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';

import { Repository } from 'typeorm';

import { CreateNonceDto } from '../dto/createNonce.dto';
import { LoginDto } from '../dto/login.dto';
import { NonceEntity } from '../entity/nonce.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(NonceEntity)
    private nonceRepository: Repository<NonceEntity>,
    private jwtService: JwtService,
  ) {}

  public async getNonce(owner: string): Promise<NonceEntity> {
    return await this.nonceRepository.findOne(
      {
        owner: owner,
      },
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );
  }

  public checkNonceValidity(date: Date): boolean {
    const thirtyMins = 1000 * 60 * 30;
    const thirtyMinsAgo = Date.now() - thirtyMins;
    return date.getTime() > thirtyMinsAgo;
  }

  public async createNonce(
    createNonceDto: CreateNonceDto,
  ): Promise<NonceEntity> {
    return await this.nonceRepository.save(createNonceDto);
  }

  public verifySignatureAndNonce(loginDto: LoginDto, nonce: string) {
    const calculatedAddress = ethers.utils.verifyMessage(
      nonce,
      loginDto.signature,
    );
    return calculatedAddress.toLowerCase() == loginDto.address;
  }

  public createJwtToken(address: string, backpackId: string): string {
    // We add the backpack id to the payload
    const payload = { sub: address, backpack: backpackId };
    return this.jwtService.sign(payload);
  }
}
