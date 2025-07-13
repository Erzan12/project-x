import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
// import { PositionStatus } from 'src/Auth/components/decorators/global.enums.decorator';
import { UserRole } from 'src/Auth/components/decorators/ability.enum';

@Injectable()
export class PositionService {
    constructor(private prisma: PrismaService, private createPositionDto: CreatePositionDto) {}

    async createPosition(createPositionDto: CreatePositionDto, req) {
        const { name, department_id, status } = createPositionDto;

        //check for role administrator
        const user = await this.prisma.user.findUnique({
            where: { id: req.user.id},
            include: {
                role: true,
            }
        })
    
        if(!user || user.role?.name !== UserRole.ADMINISTRATOR ) {
            throw new ForbiddenException('Only Administrators are allowed to create permission templates')
        }

        const existingPosition = await this.prisma.position.findFirst({
            where: { name: createPositionDto.name },
            include: {
                department: true,
            }
        })

        if(existingPosition) {
            throw new ConflictException('Position already exist! Try again')
        }

        const createdPosition = await this.prisma.position.create({
            data: {
                name: createPositionDto.name,
                department: {
                    connect: { id: createPositionDto.department_id }   // this links the foreign key
                },
                status: true
            },
            include: {
                department: true
            },
        });

        return {
            status: 'success',
            message: `Position successfully created`,
            data: {
                createdPosition,
            },
        };
    }
}
