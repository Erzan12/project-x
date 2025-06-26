export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: {
    id: number;
    name: string;
    role_permissions: {
      permission: {
        id: number;
        name: string;
        module: string;
        created_at: string;
      };
    }[];
  } | null;
  user_permissions: {
    permission: {
      id: number;
      name: string;
      module: string;
      created_at: string;
    };
  }[];
}
