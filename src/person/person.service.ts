import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PersonService {
    constructor (private prisma: PrismaService) {}

    //delete a person from db safely via transaction so that everything will rollback if during the process encounters an error
    async deletePersonSafely(personId: number): Promise<void> {
        
        // validate if person exist
        const existingPerson = await this.prisma.person.findUnique({
            where: { id: personId },
        });

        if (!existingPerson) {
            throw new NotFoundException(`No record was found, Person with ID ${personId} does not exist or was already deleted`); 
        }

        try {
            // if person exist proceed to this process for person deletion
            await this.prisma.$transaction(async (tx) => {
                await tx.emailAddress.deleteMany({
                    where: { person_id:personId },
                });

                await tx.employee.deleteMany({
                    where: { person_id: personId },
                });

                const users = await tx.user.findMany({
                    where: { person_id: personId},
                    select: { id: true },
                });

                for (const user of users) {
                    await tx.userToken.deleteMany({ where: { user_id: user.id } });
                    await tx.userPermissionCompany.deleteMany({ where: { user_id: user.id } });
                    await tx.userPermission.deleteMany({ where: { user_id: user.id } });
                    await tx.user.delete({where: { id: user.id } });
                }

                await tx.person.delete({ where: { id: personId } });
            });
        } catch (err) {
            console.error(`Failded to delete person ${personId}`, err);
            throw new InternalServerErrorException('Failed to delete person.');
        }
    }
}
