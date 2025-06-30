export enum Role {
    HR_ADMIN = 'Human Resources - Staff',
    IT_ADMIN = 'IT Manager',
    STAFF = 'Staff',
    MANAGER = 'Manager',
    FINANCE = 'Finance Officer',
    // add more as needed
}

// permission.enum.ts
export const Permission = {
  HR: {
    VIEW_EMPLOYEE: 'View Employee',
    ADD_EMPLOYEE: 'Add Employee',
    EDIT_EMPLOYEE: 'Edit Employee',
    DELETE_EMPLOYEE: 'Delete Employee',
  },
  IT: {
    APPROVE_TICKET: 'Approve Ticket',
    WORK_TICKET: 'Work Ticket',
    VIEW_TICKET: 'View Ticket',
    REPORT_TICKET: 'Report Ticket',
  },
} as const;

// ✅ Create a union of all permission string values
export type Permission =
  | (typeof Permission.HR)[keyof typeof Permission.HR]
  | (typeof Permission.IT)[keyof typeof Permission.IT];

// export enum Permission { 
//     ACCESS_DATA = 'Access Data',
//     VIEW_REPORTS = 'View Reports',
//     CREATE_REPORT = 'Create Reports',
//     EDIT_EMPLOYEE = 'Edit user',
//     DELETE_EMPLOYEE = 'Delete user',
//     EXPORT_DATA = 'Export Data',
//     // add more as needed
// }