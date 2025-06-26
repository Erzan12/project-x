import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'user' },
      { id: 2, name: 'admin' },
      { id: 3, name: 'moderator' },
    ],
    skipDuplicates: true, // Prevents error if already seeded
  });

  console.log('✅ Roles seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
