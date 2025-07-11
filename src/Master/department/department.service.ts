import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { DepartmentStatus, Role } from 'src/Auth/components/decorators/global.enums';


@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService, private createDepartmentDto: CreateDepartmentDto) {}

    async createDepartment(createDepartmentDto: CreateDepartmentDto, req) {
        const { name, division_id, status } = createDepartmentDto;

        //check for role administrator
        const user = await this.prisma.user.findUnique({
            where: { id: req.user.id},
            include: {
                role: true,
            }
        })
    
        if(!user || user.role?.name !== Role.ADMINISTRATOR ) {
            throw new ForbiddenException('Only Administrators are allowed to create permission templates')
        }

        const existingPosition = await this.prisma.department.findFirst({
            where: { name: createDepartmentDto.name },
            include: {
                division: true,
            }
        })
        if(existingPosition) {
            throw new ConflictException('Position already exist! Try again')
        }

        
        const createdDepartment = await this.prisma.department.create({
            data: {
                name: createDepartmentDto.name,
                division: {
                    connect: { id: createDepartmentDto.division_id }   // this links the foreign key
                },
                status: true
            },
            include: {
                division: true
            },
        });

        return {
            status: 'success',
            message: `Department successfully created`,
            data: {
                createdDepartment,
            },
        };
    }
}
