// types/request-user.interface.ts
// export interface RequestUser {
//   id: number;
//   email: string;
//   role: {
//     id: number;
//     name: string;
//     role_permissions: {
//       action: string;
//       permission: { name: string };
//       status: boolean;
//     }[];
//   };
//   module: { id: number; name: string };
// }

export interface RequestUser {
  id: number;
  email: string;
  roles: {
    id: number;
    name: string;
    module: {
      id: number;
      name: string;
    };
    permissions: {
      action: string;
      permission: {
        name: string;
      };
      status: boolean;
    }[];
  }[];
}


//working
// export interface RequestUser {
//   id: number;
//   email: string;
//   roles: {
//     id: number;
//     name: string;
//     permissions: {
//       action: string;
//       permission: {
//         name: string;
//       };
//       status: boolean;
//     }[];
//   }[];
//   module: {
//     id: number;
//     name: string;
//   }[];
// }


// export interface RolePermission {
//   action: string;
//   permission: { name: string };
//   status: boolean;
// }

// export interface UserRole {
//   id: number;
//   name: string;
//   permissions: RolePermission[];
// }

// export interface RequestUser {
//   id: number;
//   email: string;
//   roles: UserRole[];
//   module: {
//     id: number;
//     name: string;
//   };
// }

