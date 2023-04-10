export { UserModel } from '@prisma/client';

export interface UserCreateDto {
  name: string;
  password: string;
}
