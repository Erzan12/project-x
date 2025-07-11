import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    role: string;
    // this interface extends to user controller for sending new reset token to user
    // Add more fields from JWT if needed 
  };
}