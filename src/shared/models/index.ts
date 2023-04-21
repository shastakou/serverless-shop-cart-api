import { Request } from 'express';

import { UserModel } from '../../users';

export interface AppRequest extends Request {
  user?: { id: string; name: string };
}
