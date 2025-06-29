import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.role.createMany()

    // Add other unseed operations as needed
    console.log('Unseed complete.')
  } catch (error) {
    console.error('Error during unseeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
