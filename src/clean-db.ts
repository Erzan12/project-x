import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanup() {
  // Delete in reverse order of dependency
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.rolePermission.deleteMany(); // clean dependencies first
  await prisma.role.deleteMany();
  await prisma.company.deleteMany();
  await prisma.person.deleteMany();
  await prisma.department.deleteMany();
  await prisma.division.deleteMany();
  // await prisma.permission.deleteMany();

  console.log('Database cleaned');
}

cleanup()
  .catch((err) => {
    console.error('Error during cleanup:', err);
  })
  .finally(() => prisma.$disconnect());
