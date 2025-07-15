// import { Request } from 'express';

// export interface RequestWithUser extends Request {
//   user: {
//     id: number;
//     username: string;
//   };
// }

// types/request-user.interface.ts
export interface RequestUser {
  id: string;
  email: string;
  role: {
    role: number;
    role_permissions: {
      action: string;
      permission: { name: string };
      status: boolean;
    }[];
  };
  module: { id: number; name: string };
}
