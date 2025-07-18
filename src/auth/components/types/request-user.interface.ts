// types/request-user.interface.ts
export interface RequestUser {
  id: number;
  email: string;
  role: {
    id: number;
    name: string;
    role_permissions: {
      action: string;
      permission: { name: string };
      status: boolean;
    }[];
  };
  module: { id: number; name: string };
}
