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
      position_id: 2,
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
      position_id: 1,
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
      position_id: 1,
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