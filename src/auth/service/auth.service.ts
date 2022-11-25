import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { ethers } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { NonceEntity } from '../entity/nonce.entity';
import { Repository } from 'typeorm';
import { CreateNonceDto } from '../dto/createNonce.dto';
import { ConfigService } from '@nestjs/config';
import { Scopes } from 'src/oauth/enum/scopes.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(NonceEntity)
    private readonly nonceRepository: Repository<NonceEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getNonce(owner: string): Promise<NonceEntity> {
    return await this.nonceRepository.findOne({
      where: {
        owner: owner,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public checkNonceValidity(date: Date): boolean {
    const validTimeframe = 30 * 60 * 1000;
    const expirationTimestamp = date.getTime() + validTimeframe;
    const expired = Date.now() > expirationTimestamp;
    return expired;
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

  public createJwtToken(address: string, spaceId: string): string {
    const payload = {
      sub: address,
      space: spaceId,
      scopes: [
        Scopes['avatars:read'],
        Scopes['avatars:create'],
        Scopes['avatars:update'],
        Scopes['avatars:delete'],
      ],
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
  }
}
