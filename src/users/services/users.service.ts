import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash } from 'bcryptjs';

import { CreateUserDto, User } from '../models';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  findUserByName(name: string): Promise<User | null> {
    return this.prisma.users.findFirst({ where: { name } });
  }

  async createUser({ name, password }: CreateUserDto): Promise<User> {
    const salt = await genSalt(Number(this.config.get<string>('HASH_SALT')));
    const hashedPassword = await hash(password, salt);
    return this.prisma.users.create({
      data: { name, password: hashedPassword },
    });
  }
}
