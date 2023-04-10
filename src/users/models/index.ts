export { users as User } from '@prisma/client';

export interface CreateUserDto {
  name: string;
  password: string;
}
