import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash } from 'bcryptjs';

import { UserCreateDto, UserModel } from '../models';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  findUserByName(name: string): Promise<UserModel | null> {
    return this.prisma.userModel.findFirst({ where: { name } });
  }

  async createUser({ name, password }: UserCreateDto): Promise<UserModel> {
    const salt = await genSalt(Number(this.config.get<string>('HASH_SALT')));
    const hashedPassword = await hash(password, salt);
    return this.prisma.userModel.create({
      data: { name, password: hashedPassword },
    });
  }
}
