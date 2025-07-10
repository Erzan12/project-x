//with role and role permission latest seed
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  // 1. Seed Companies
  const [abisc, abmci, svsc, lmvc] = await Promise.all(
    ['ABISC', 'ABMCI', 'SVSC', 'LMVC'].map((abbr) =>
      prisma.company.upsert({
        where: { abbreviation: abbr },
        update: {},
        create: { name: abbr, abbreviation: abbr, company_code: abbr },
      }),
    )
  );

  // 2. Seed Persons
  const hrPerson = await prisma.person.create({
    data: {
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: new Date('1990-01-01'),
    },
  });

  const itPerson = await prisma.person.create({
    data: {
      first_name: 'Alfred',
      last_name: 'Sanchez',
      date_of_birth: new Date('1985-05-01'),
    },
  });

  const adminPerson = await prisma.person.create({
    data: {
      first_name: 'Earl Jan',
      last_name: 'Do',
      date_of_birth: new Date('2000-05-12'),
    },
  });

  // 3. Create Divisions
  const assetMgmt = await prisma.division.create({
    data: { name: 'Asset Management', division_head_id: 0 },
  });

  const corpServices = await prisma.division.create({
    data: { name: 'Corporate Services', division_head_id: 0 },
  });

  // 4. Create Departments
  const hrDept = await prisma.department.create({
    data: {
      name: 'HUMAN RESOURCES DEPARTMENT',
      division_id: corpServices.id,
      department_head_id: 0,
    },
  });

  const itDept = await prisma.department.create({
    data: {
      name: 'I.T DEPARTMENT',
      division_id: assetMgmt.id,
      department_head_id: 0,
    },
  });

  // 5. Create Modules
  const hrModule = await prisma.module.create({
    data: {
      name: 'Human Resources',
    },
  });

  const managerModule = await prisma.module.create({
    data: {
      name: 'Managers Access',
    },
  });

  // 6. Create SubModules
  await prisma.subModule.createMany({
    data: [
      { name: 'Employee Masterlist', module_id: hrModule.id },
      { name: 'Dashboard', module_id: hrModule.id },
      { name: 'User Account', module_id: managerModule.id },
      { name: 'Dashboard', module_id: managerModule.id },
    ],
    skipDuplicates: true,
  });

  const subModules = await prisma.subModule.findMany();

  // 7. Create Permissions
  const permissions = [
    { action: 'view', sub_module_id: 1 },
    { action: 'edit', sub_module_id: 1 },
    { action: 'approve', sub_module_id: 1 },
    { action: 'view', sub_module_id: 2 },
    { action: 'edit', sub_module_id: 2 },
    { action: 'view', sub_module_id: 3 },
    { action: 'work', sub_module_id: 3 },
    { action: 'report', sub_module_id: 3 },
    { action: 'access', sub_module_id: 4 },
    { action: 'add', sub_module_id: 4 },
  ];

  const permissionRecords = await Promise.all(
    permissions.map((perm) =>
      prisma.subModulePermission.create({
        data: perm,
      })
    )
  );

  // 8. Create Roles
  const roleNames = [
    'Administrator',
    'Human Resources',
    'Accounting',
    'Operations',
    'Payroll',
    'Inventory',
    'Purchasing',
    'Finance',
    'Asset Management',
    'Compliance',
    'Information Technology',
    'Eportal User',
  ];

  const roleRecords = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      }),
    )
  );

  const adminRole = roleRecords.find((r) => r.name === 'Administrator')!;
  const hrRole = roleRecords.find((r) => r.name === 'Human Resources')!;
  const itRole = roleRecords.find((r) => r.name === 'Information Technology')!;

  // 9. Create RolePermissions
  await prisma.rolePermission.createMany({
    data: [
      {
        role_id: hrRole.id,
        sub_module_id: permissionRecords[0].sub_module_id,
        module_id: hrModule.id,
        action: permissionRecords[0].action,
        sub_module_permission_id: permissionRecords[0].id,
      },
      {
        role_id: hrRole.id,
        sub_module_id: permissionRecords[1].sub_module_id,
        module_id: hrModule.id,
        action: permissionRecords[1].action,
        sub_module_permission_id: permissionRecords[1].id,
      },
      {
        role_id: itRole.id,
        sub_module_id: permissionRecords[6].sub_module_id,
        module_id: managerModule.id,
        action: permissionRecords[6].action,
        sub_module_permission_id: permissionRecords[6].id,
      },
      {
        role_id: itRole.id,
        sub_module_id: permissionRecords[7].sub_module_id,
        module_id: managerModule.id,
        action: permissionRecords[7].action,
        sub_module_permission_id: permissionRecords[7].id,
      },
    ],
    skipDuplicates: true,
  });

  // 10. Create Employees
  const hrEmployee = await prisma.employee.create({
    data: {
      person_id: hrPerson.id,
      employee_id: 'EMP-HR-001',
      company_id: abisc.id,
      department_id: hrDept.id,
      hire_date: new Date('2023-01-01'),
      position: 'HR Manager',
      salary: 30000,
      pay_frequency: 'Monthly',
      employment_status: 'Active',
      monthly_equivalent_salary: 30000,
      corporate_rank_id: 2,
    },
  });

  const itEmployee = await prisma.employee.create({
    data: {
      person_id: itPerson.id,
      employee_id: 'EMP-IT-001',
      company_id: abmci.id,
      department_id: itDept.id,
      hire_date: new Date('2022-01-01'),
      position: 'IT Manager',
      salary: 60000,
      pay_frequency: 'Monthly',
      employment_status: 'Active',
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });

  const adminEmployee = await prisma.employee.create({
    data: {
      person_id: adminPerson.id,
      employee_id: 'EMP-IT-002',
      company_id: lmvc.id,
      department_id: itDept.id,
      hire_date: new Date('2025-05-12'),
      position: 'Jr Web Developer',
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status: 'Active',
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });

  // 11. Update division/department heads
  await prisma.division.update({ where: { id: assetMgmt.id }, data: { division_head_id: itEmployee.id } });
  await prisma.division.update({ where: { id: corpServices.id }, data: { division_head_id: hrEmployee.id } });
  await prisma.department.update({ where: { id: itDept.id }, data: { department_head_id: itEmployee.id } });
  await prisma.department.update({ where: { id: hrDept.id }, data: { department_head_id: hrEmployee.id } });

  // 12. Create Users
  const hrUser = await prisma.user.create({
    data: {
      employee_id: hrEmployee.id,
      username: 'hr.staff',
      email: 'hr@abas.com',
      password: '$2b$12$iks.Lzf0hVod5nZRERqRSejAz0IVV4DnTGcH9XJjHSkkS19E6btQG',
      role_id: hrRole.id,
      person_id: hrPerson.id,
    },
  });

  const itUser = await prisma.user.create({
    data: {
      employee_id: itEmployee.id,
      username: 'it.manager',
      email: 'it@abas.com',
      password: '$2b$12$4W60KW9bCajFDJWvzGD1LeHPokn2FcdO5i.LPYHmFHwjzYT2TAdbW',
      role_id: itRole.id,
      person_id: itPerson.id,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      employee_id: adminEmployee.id,
      username: 'admin',
      email: 'admin@yourdomain.com',
      password: '$2y$10$UGYEBYURPcDplaRlaBvgB.sGvQRs9vZxZQ6/JzC6cvmb3ygTbA/2G',
      role_id: adminRole.id,
      person_id: adminPerson.id,
    },
  });

  // 13. Create UserRoles
  const userRoles = await prisma.userRole.createMany({
    data: [
      { user_id: hrUser.id, role_id: hrRole.id, module_id: hrDept.id, created_at: now },
      { user_id: itUser.id, role_id: itRole.id, module_id: itDept.id, created_at: now },
      { user_id: adminUser.id, role_id: adminRole.id, module_id: itDept.id, created_at: now },
    ],
  });

  const allUserRoles = await prisma.userRole.findMany();

  // 14. Create UserPermissions
  const createUserPermissions = await prisma.userPermission.createMany({
    data: [
      {
        user_id: hrUser.id,
        user_role_permission: permissionRecords[0].action,
        user_role_id: allUserRoles.find((r) => r.user_id === hrUser.id)!.id,
      },
      {
        user_id: itUser.id,
        user_role_permission: permissionRecords[6].action,
        user_role_id: allUserRoles.find((r) => r.user_id === itUser.id)!.id,
      },
    ],
  });

  // 15. Seed Password Reset Tokens
  await prisma.passwordResetToken.createMany({
    data: [
      {
        token: uuidv4(),
        user_id: hrUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        used: false,
      },
      {
        token: uuidv4(),
        user_id: itUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        used: false,
      },
      {
        token: uuidv4(),
        user_id: adminUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        used: false,
      },
    ],
  });

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());



// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';

// const prisma = new PrismaClient();

// async function main() {
//   const now = new Date();

//   // 1. Seed Companies
//   const [abisc, abmci, svsc, lmvc] = await Promise.all(
//     ['ABISC', 'ABMCI', 'SVSC', 'LMVC'].map((abbr) =>
//       prisma.company.upsert({
//         where: { abbreviation: abbr },
//         update: {},
//         create: { name: abbr, abbreviation: abbr },
//       }),
//     )
//   );

//   // 2. Seed Persons
//   const hrPerson = await prisma.person.create({
//     data: {
//       first_name: 'Jane',
//       last_name: 'Doe',
//       date_of_birth: new Date('1990-01-01'),
//     },
//   });

//   const itPerson = await prisma.person.create({
//     data: {
//       first_name: 'Alfred',
//       last_name: 'Sanchez',
//       date_of_birth: new Date('1985-05-01'),
//     },
//   });

//   const adminPerson = await prisma.person.create({
//     data: {
//       first_name: 'Earl Jan',
//       last_name: 'Do',
//       date_of_birth: new Date('2000-05-12'),
//     },
//   });

//   // 3. Create Divisions
//   const assetMgmt = await prisma.division.create({
//     data: { name: 'Asset Management', division_head_id: 0 },
//   });

//   const corpServices = await prisma.division.create({
//     data: { name: 'Corporate Services', division_head_id: 0 },
//   });

//   // 4. Create Departments
//   const hrDept = await prisma.department.create({
//     data: {
//       name: 'HUMAN RESOURCES DEPARTMENT',
//       division_id: corpServices.id,
//       department_head_id: 0,
//     },
//   });

//   const itDept = await prisma.department.create({
//     data: {
//       name: 'I.T DEPARTMENT',
//       division_id: assetMgmt.id,
//       department_head_id: 0,
//     },
//   });

//   // 1. Create modules
//   const hrModule = await prisma.module.create({
//   data: {
//     name: 'Human Resources',
//     created_by: new Date(),
//     },
//   });

//   const managerModule = await prisma.module.create({
//     data: {
//       name: 'Managers Access',
//       created_by: new Date(),
//     },
//   });

//   // 5. Create SubModules
//   await prisma.subModule.createMany({
//     data: [
//       { name: 'Employee Masterlist', module_id: hrModule.id },
//       { name: 'Dashboard', module_id: hrModule.id },
//     ],
//     skipDuplicates: true,
//   });

//   await prisma.subModule.createMany({
//     data: [
//       { name: 'User Account', module_id: managerModule.id },
//       { name: 'Dashboard', module_id: managerModule.id },
//     ],
//     skipDuplicates: true,
//   });

//   const subModules = await prisma.subModule.findMany();

//   const subModuleMap = new Map(subModules.map((s) => [s.id, s.module_id]));

//   // 6. Create Permissions
//   const permissions = [
//     { action: 'view', sub_module_id: 1 },
//     { action: 'edit', sub_module_id: 1 },
//     { action: 'approve', sub_module_id: 1 },
//     { action: 'view', sub_module_id: 2 },
//     { action: 'edit', sub_module_id: 2 },
//     { action: 'view', sub_module_id: 3 },
//     { action: 'work', sub_module_id: 3 },
//     { action: 'report', sub_module_id: 3 },
//     { action: 'access', sub_module_id: 4 },
//     { action: 'add', sub_module_id: 4 },
//   ];

//   const permissionRecords = await Promise.all(
//     permissions.map((perm) =>
//       prisma.subModulePermission.create({
//         data: perm,
//       })
//     )
//   );

//   // 7. Create Roles
//   const roleNames = [
//     'Administrator',
//     'Human Resources',
//     'Accounting',
//     'Operations',
//     'Payroll',
//     'Inventory',
//     'Purchasing',
//     'Finance',
//     'Asset Management',
//     'Compliance',
//     'Information Technology',
//     'Eportal User',
//   ];

//   const roleRecords = await Promise.all(
//     roleNames.map((name) =>
//       prisma.role.upsert({
//         where: { name },
//         update: {},
//         create: { name },
//       }),
//     )
//   );

//   const adminRole = roleRecords.find((r) => r.name === 'Administrator')!;
//   const hrRole = roleRecords.find((r) => r.name === 'Human Resources')!;
//   const itRole = roleRecords.find((r) => r.name === 'Information Technology')!;

//   // 8. Create RolePermissions
//   // await prisma.rolePermission.createMany({
//   //   data: [
//   //     { role_id: hrRole.id, sub_module_id: permissionRecords[0].id },
//   //     { role_id: hrRole.id, sub_module_id: permissionRecords[1].id },
//   //     { role_id: itRole.id, sub_module_id: permissionRecords[6].id },
//   //     { role_id: itRole.id, sub_module_id: permissionRecords[7].id },
//   //   ],
//   //   skipDuplicates: true,
//   // });

//   await prisma.rolePermission.createMany({
//     data: [
//       {
//         role_id: hrRole.id,
//         permission_id: permissionRecords[0].sub_module_id, // or id
//         module_id: hrModule.id,
//         action: permissionRecords[0].action
//       },
//       {
//         role_id: hrRole.id,
//         permission_id: permissionRecords[1].sub_module_id,
//         module_id: hrModule.id,
//         action: permissionRecords[1].action
//       },
//       {
//         role_id: itRole.id,
//         permission_id: permissionRecords[6].sub_module_id,
//         module_id: managerModule.id,
//         action: permissionRecords[6].action
//       },
//       {
//         role_id: itRole.id,
//         permission_id: permissionRecords[7].sub_module_id,
//         module_id: managerModule.id,
//         action: permissionRecords[7].action
//       }
//     ],
//     skipDuplicates: true,
//   });

//   // 9. Create Employees
//   const hrEmployee = await prisma.employee.create({
//     data: {
//       person_id: hrPerson.id,
//       employee_id: 'EMP-HR-001',
//       company_id: abisc.id,
//       department_id: hrDept.id,
//       hire_date: new Date('2023-01-01'),
//       position: 'HR Manager',
//       salary: 30000,
//       pay_frequency: 'Monthly',
//       employment_status: 'Active',
//       monthly_equivalent_salary: 30000,
//       corporate_rank_id: 2,
//     },
//   });

//   const itEmployee = await prisma.employee.create({
//     data: {
//       person_id: itPerson.id,
//       employee_id: 'EMP-IT-001',
//       company_id: abmci.id,
//       department_id: itDept.id,
//       hire_date: new Date('2022-01-01'),
//       position: 'IT Manager',
//       salary: 60000,
//       pay_frequency: 'Monthly',
//       employment_status: 'Active',
//       monthly_equivalent_salary: 60000,
//       corporate_rank_id: 1,
//     },
//   });

//   const adminEmployee = await prisma.employee.create({
//     data: {
//       person_id: adminPerson.id,
//       employee_id: 'EMP-IT-002',
//       company_id: lmvc.id,
//       department_id: itDept.id,
//       hire_date: new Date('2025-05-12'),
//       position: 'Jr Web Developer',
//       salary: 20000,
//       pay_frequency: 'Monthly',
//       employment_status: 'Active',
//       monthly_equivalent_salary: 60000,
//       corporate_rank_id: 1,
//     },
//   });

//   // 10. Update division and department heads
//   await prisma.division.update({
//     where: { id: assetMgmt.id },
//     data: { division_head_id: itEmployee.id },
//   });

//   await prisma.division.update({
//     where: { id: corpServices.id },
//     data: { division_head_id: hrEmployee.id },
//   });

//   await prisma.department.update({
//     where: { id: itDept.id },
//     data: { department_head_id: itEmployee.id },
//   });

//   await prisma.department.update({
//     where: { id: hrDept.id },
//     data: { department_head_id: hrEmployee.id },
//   });

//   // 11. Create Users
//   const hrPassword = '$2b$12$iks.Lzf0hVod5nZRERqRSejAz0IVV4DnTGcH9XJjHSkkS19E6btQG';
//   const itPassword = '$2b$12$4W60KW9bCajFDJWvzGD1LeHPokn2FcdO5i.LPYHmFHwjzYT2TAdbW';
//   const adminPassword = '$2y$10$UGYEBYURPcDplaRlaBvgB.sGvQRs9vZxZQ6/JzC6cvmb3ygTbA/2G';

//     // Create admin
//   const adminUser = await prisma.user.create({
//     data:{
//       employee_id: adminEmployee.id, //placeholder, should match an actual employee
//       username: 'admin',
//       email: 'admin@yourdomain.com',
//       password: adminPassword,
//       role_id: adminRole.id,
//       person_id: adminPerson.id,
//     }
//   })

//   const hrUser = await prisma.user.create({
//     data: {
//       employee_id: hrEmployee.id,
//       username: 'hr.staff',
//       email: 'hr@abas.com',
//       password: hrPassword,
//       role_id: hrRole.id,
//       person_id: hrPerson.id,
//     },
//   });

//   const itUser = await prisma.user.create({
//     data: {
//       employee_id: itEmployee.id,
//       username: 'it.manager',
//       email: 'it@abas.com',
//       password: itPassword,
//       role_id: itRole.id,
//       person_id: itPerson.id,
//     },
//   });

//   // 12. Create UserRoles
//   await prisma.userRole.createMany({
//     data: [
//       {
//         user_id: hrUser.id,
//         role_id: hrRole.id,
//         department_id: hrDept.id,
//         created_at: now,
//       },
//       {
//         user_id: itUser.id,
//         role_id: itRole.id,
//         department_id: itDept.id,
//         created_at: now,
//       },
//       {
//         user_id: adminUser.id,
//         role_id: adminRole.id,
//         department_id: itDept.id,
//         created_at: now,
//       }
//     ],
//   });

//   // 13. Seed Password Reset Tokens
//   await prisma.passwordResetToken.createMany({
//     data: [
//       {
//         token: '4ee27a05-de7d-4d72-a193-ad657565549c',
//         user_id: hrUser.id,
//         expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
//         used: false,
//       },
//       {
//         token: 'bb50fa8b-d00c-46cf-8644-a74c0c028251',
//         user_id: itUser.id,
//         expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
//         used: false,
//       },
//       {
//         token: 'e2d58c09-8f23-4b3f-a7a1-57a24fcd9831',
//         user_id: adminUser.id,
//         expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24), // Expires in 24 hours,
//         used: false
//       }
//     ],
//   });

//   console.log('✅ Seeding completed successfully.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());


// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';

// const prisma = new PrismaClient();

// async function main() {
//   // Create Companies
//   const [abisc, abmci, svsc, lmvc] = await Promise.all([
//     prisma.company.upsert({
//       where: { abbreviation: 'ABISC' },
//       update: {},
//       create: { name: 'ABISC', abbreviation: 'ABISC' },
//     }),
//     prisma.company.upsert({
//       where: { abbreviation: 'ABMCI' },
//       update: {},
//       create: { name: 'ABMCI', abbreviation: 'ABMCI' },
//     }),
//     prisma.company.upsert({
//       where: { abbreviation: 'SVSC' },
//       update: {},
//       create: { name: 'SVSC', abbreviation: 'SVSC' },
//     }),
//     prisma.company.upsert({
//       where: { abbreviation: 'LMVC' },
//       update: {},
//       create: { name: 'LMVC', abbreviation: 'LMVC' },
//     }),
//   ]);

//   // Seed Persons
//   const hrPerson = await prisma.person.create({
//     data: {
//       first_name: 'HR',
//       last_name: 'Manager',
//       date_of_birth: new Date('1990-01-01'),
//     },
//   });

//   const itPerson = await prisma.person.create({
//     data: {
//       first_name: 'IT',
//       last_name: 'Manager',
//       date_of_birth: new Date('1985-05-01'),
//     },
//   });

//   // Create Divisions with placeholder heads (we will update later)
//   const assetMgmt = await prisma.division.create({
//     data: { name: 'Asset Management', division_head_id: 0 }, // updated later
//   });

//   const corpServices = await prisma.division.create({
//     data: { name: 'Corporate Services', division_head_id: 0 },
//   });

//   // Create Departments
//   const itDept = await prisma.department.create({
//     data: {
//       name: 'I.T DEPARTMENT',
//       division_id: assetMgmt.id,
//       department_head_id: 0, // updated later
//     },
//   });

//   const hrDept = await prisma.department.create({
//     data: {
//       name: 'HUMAN RESOURCES DEPARTMENT',
//       division_id: corpServices.id,
//       department_head_id: 0,
//     },
//   });

//   // Create Roles
//   const [adminRole, hrRole, itRole] = await Promise.all(
//     ['Administrator', 'Human Resources', 'Information Technology'].map((name) =>
//       prisma.role.upsert({
//         where: { name },
//         update: {},
//         create: { name },
//       })
//     )
//   );

//   // Create Permissions
//   const permissions = [
//     { action: 'View Employee', module: 'HR' },
//     { action: 'Add Employee', module: 'HR' },
//     { action: 'Edit Employee', module: 'HR' },
//     { action: 'Delete Employee', module: 'HR' },
//     { action: 'Approve Ticket', module: 'IT' },
//     { action: 'Work Ticket', module: 'IT' },
//     { action: 'View Ticket', module: 'IT' },
//     { action: 'Report Ticket', module: 'IT' },
//   ];

//   const permissionRecords = await Promise.all(
//     permissions.map((perm) =>
//       prisma.permission.upsert({
//         where: { action: perm.action },
//         include: { department.name },
//         update: {},
//         create: perm,
//       })
//     )
//   );

//   // Assign RolePermissions
//   await prisma.rolePermission.createMany({
//     data: [
//       ...[0, 1, 2].map((i) => ({
//         role_id: hrRole.id,
//         permission_id: permissionRecords[i].id,
//       })),
//       ...[3, 4, 5, 6].map((i) => ({
//         role_id: itRole.id,
//         permission_id: permissionRecords[i].id,
//       })),
//     ],
//     skipDuplicates: true,
//   });
//   // Hash passwords
//   const hrPassword = await bcrypt.hash('hr1234', 10);
//   const itPassword = await bcrypt.hash('it1234', 10);

//   // Create Employees (with company & department info)
//   const hrEmployee = await prisma.employee.create({
//     data: {
//       person_id: hrPerson.id,
//       employee_id: 'EMP-HR-001',
//       company_id: abisc.id,
//       department_id: hrDept.id,
//       hire_date: new Date('2023-01-01'),
//       position: 'HR Manager',
//       salary: 30000,
//       pay_frequency: 'Monthly',
//       employment_status: 'Active',
//       monthly_equivalent_salary: 30000,
//       corporate_rank_id: 2,
//     },
//   });

//   const itEmployee = await prisma.employee.create({
//     data: {
//       person_id: itPerson.id,
//       employee_id: 'EMP-IT-001',
//       company_id: abmci.id,
//       department_id: itDept.id,
//       hire_date: new Date('2022-01-01'),
//       position: 'IT Manager',
//       salary: 60000,
//       pay_frequency: 'Monthly',
//       employment_status: 'Active',
//       monthly_equivalent_salary: 60000,
//       corporate_rank_id: 1,
//     },
//   });

//   // Update division and department heads
//   await prisma.division.update({
//     where: { id: assetMgmt.id },
//     data: { division_head_id: itEmployee.id },
//   });

//   await prisma.division.update({
//     where: { id: corpServices.id },
//     data: { division_head_id: hrEmployee.id },
//   });

//   await prisma.department.update({
//     where: { id: itDept.id },
//     data: { department_head_id: itEmployee.id },
//   });

//   await prisma.department.update({
//     where: { id: hrDept.id },
//     data: { department_head_id: hrEmployee.id },
//   });

//   // Create Users, linked to Employees
//   const hrUser = await prisma.user.create({
//     data: {
//       employee_id: hrEmployee.id,
//       username: 'hr.staff',
//       email: 'hr@abas.com',
//       password: hrPassword,
//       role_id: hrRole.id,
//       person_id: hrPerson.id,
//     },
//   });

//   const itUser = await prisma.user.create({
//     data: {
//       employee_id: itEmployee.id,
//       username: 'it.manager',
//       email: 'it@abas.com',
//       password: itPassword,
//       role_id: itRole.id,
//       person_id: itPerson.id,
//     },
//   });

//   // Update employee records with userId
//   // user is not since the only time User and Employee are linked is during user creation by the manager.
//   // await prisma.employee.update({
//   //   where: { id: hrEmployee.id },
//   //   data: { user_id: hrUser.id },
//   // });

//   // await prisma.employee.update({
//   //   where: { id: itEmployee.id },
//   //   data: { user_id: itUser.id },
//   // });

//   // Create Password Reset Tokens
//   const now = new Date();
//   const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);

//   await prisma.passwordResetToken.createMany({
//     data: [
//       {
//         token: uuidv4(),
//         user_id: hrUser.id,
//         expires_at: expiresAt,
//         used: false,
//       },
//       {
//         token: uuidv4(),
//         user_id: itUser.id,
//         expires_at: expiresAt,
//         used: false,
//       },
//     ],
//   });

//   console.log('✅ Seeding complete with departments and companies assigned.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());
