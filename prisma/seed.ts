import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create Companies
  const [abisc, abmci, svsc, lmvc] = await Promise.all([
    prisma.company.upsert({
      where: { abbreviation: 'ABISC' },
      update: {},
      create: { name: 'ABISC', abbreviation: 'ABISC' },
    }),
    prisma.company.upsert({
      where: { abbreviation: 'ABMCI' },
      update: {},
      create: { name: 'ABMCI', abbreviation: 'ABMCI' },
    }),
    prisma.company.upsert({
      where: { abbreviation: 'SVSC' },
      update: {},
      create: { name: 'SVSC', abbreviation: 'SVSC' },
    }),
    prisma.company.upsert({
      where: { abbreviation: 'LMVC' },
      update: {},
      create: { name: 'LMVC', abbreviation: 'LMVC' },
    }),
  ]);

  // Seed Persons
  const hrPerson = await prisma.person.create({
    data: {
      first_name: 'HR',
      last_name: 'Manager',
      date_of_birth: new Date('1990-01-01'),
    },
  });

  const itPerson = await prisma.person.create({
    data: {
      first_name: 'IT',
      last_name: 'Manager',
      date_of_birth: new Date('1985-05-01'),
    },
  });

  // Create Divisions with placeholder heads (we will update later)
  const assetMgmt = await prisma.division.create({
    data: { name: 'Asset Management', division_head_id: 0 }, // updated later
  });

  const corpServices = await prisma.division.create({
    data: { name: 'Corporate Services', division_head_id: 0 },
  });

  // Create Departments
  const itDept = await prisma.department.create({
    data: {
      name: 'I.T DEPARTMENT',
      division_id: assetMgmt.id,
      department_head_id: 0, // updated later
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      name: 'HUMAN RESOURCES DEPARTMENT',
      division_id: corpServices.id,
      department_head_id: 0,
    },
  });

  // Create Roles
  const [adminRole, hrRole, itRole] = await Promise.all(
    ['Administrator', 'Human Resources', 'Information Technology'].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Create Permissions
  const permissions = [
    { name: 'View Employee', module: 'HR' },
    { name: 'Add Employee', module: 'HR' },
    { name: 'Edit Employee', module: 'HR' },
    { name: 'Delete Employee', module: 'HR' },
    { name: 'Approve Ticket', module: 'IT' },
    { name: 'Work Ticket', module: 'IT' },
    { name: 'View Ticket', module: 'IT' },
    { name: 'Report Ticket', module: 'IT' },
  ];

  const permissionRecords = await Promise.all(
    permissions.map((perm) =>
      prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      })
    )
  );

  // Assign RolePermissions
  await prisma.rolePermission.createMany({
    data: [
      ...[0, 1, 2].map((i) => ({
        role_id: hrRole.id,
        permission_id: permissionRecords[i].id,
      })),
      ...[3, 4, 5, 6].map((i) => ({
        role_id: itRole.id,
        permission_id: permissionRecords[i].id,
      })),
    ],
    skipDuplicates: true,
  });
  // Hash passwords
  const hrPassword = await bcrypt.hash('hr1234', 10);
  const itPassword = await bcrypt.hash('it1234', 10);

  // Create Employees (with company & department info)
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

  // Update division and department heads
  await prisma.division.update({
    where: { id: assetMgmt.id },
    data: { division_head_id: itEmployee.id },
  });

  await prisma.division.update({
    where: { id: corpServices.id },
    data: { division_head_id: hrEmployee.id },
  });

  await prisma.department.update({
    where: { id: itDept.id },
    data: { department_head_id: itEmployee.id },
  });

  await prisma.department.update({
    where: { id: hrDept.id },
    data: { department_head_id: hrEmployee.id },
  });

  // Create Users, linked to Employees
  const hrUser = await prisma.user.create({
    data: {
      employee_id: hrEmployee.id,
      username: 'hr.staff',
      email: 'hr@abas.com',
      password: hrPassword,
      role_id: hrRole.id,
      person_id: hrPerson.id,
    },
  });

  const itUser = await prisma.user.create({
    data: {
      employee_id: itEmployee.id,
      username: 'it.manager',
      email: 'it@abas.com',
      password: itPassword,
      role_id: itRole.id,
      person_id: itPerson.id,
    },
  });

  // Update employee records with userId
  // user is not since the only time User and Employee are linked is during user creation by the manager.
  // await prisma.employee.update({
  //   where: { id: hrEmployee.id },
  //   data: { user_id: hrUser.id },
  // });

  // await prisma.employee.update({
  //   where: { id: itEmployee.id },
  //   data: { user_id: itUser.id },
  // });

  // Create Password Reset Tokens
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);

  await prisma.passwordResetToken.createMany({
    data: [
      {
        token: uuidv4(),
        user_id: hrUser.id,
        expires_at: expiresAt,
        used: false,
      },
      {
        token: uuidv4(),
        user_id: itUser.id,
        expires_at: expiresAt,
        used: false,
      },
    ],
  });

  console.log('✅ Seeding complete with departments and companies assigned.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
