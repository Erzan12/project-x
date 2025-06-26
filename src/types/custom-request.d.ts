import { Request } from 'express';
import { AuthenticatedUser } from './authenticated-user';

export interface CustomRequest extends Request {
  user: AuthenticatedUser;
}
