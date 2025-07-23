import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UserRole } from 'src/Auth/components/decorators/ability';
import { UpdateDeptInfoDto } from './dto/update-dept.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService, private createDepartmentDto: CreateDepartmentDto) {}

    async createDepartment(createDepartmentDto: CreateDepartmentDto, user) {
        const { name, division_id, status } = createDepartmentDto;

        //check for role administrator
        // const user = await this.prisma.user.findUnique({
        //     where: { id: req.user.id},
        //     include: {
        //         role: true,
        //     }
        // })
    
        // if(!user || user.role?.name !== UserRole.ADMINISTRATOR ) {
        //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
        // }

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

    async updateDeptInfo(updateDeptInfoDto: UpdateDeptInfoDto, user: RequestUser) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDeptInfoDto.department_id }
        })
        if(!existingDept){
            throw new BadRequestException('Department does not exist');
        }

        const updatedDept = await this.prisma.department.update({
            where: { id: updateDeptInfoDto.department_id },
            data: {
                name: updateDeptInfoDto.department_name,  // assuming you want to change the name
                status: updateDeptInfoDto.status,
                //will be added to department schema updated_by and updated_at fields
                // updated_by: user.id,           // optional: if you track who updated it
                // updated_at: new Date(),        // optional: if you track timestamps
            },
        });

        return {
            message: 'Department updated successfully.',
            data: updatedDept,
        };
    }

    async deactivateDept (updateDeptInfoDto: UpdateDeptInfoDto, user: RequestUser) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDeptInfoDto.department_id },
            select: {
                name: true,
                status: true,
            },
        });

        if(!existingDept){
            throw new BadRequestException('Department does not exist');
        }

        const deactivate = await this.prisma.department.update({
            where: { id: updateDeptInfoDto.department_id },
            data: {
                status: updateDeptInfoDto.status,
            }
        })

        return {
            status: 'success',
            message: `${existingDept.name} deactivated successfully`,
            data: deactivate,
        }
    }

    async reactivateDept(updateDeptInfoDto: UpdateDeptInfoDto, user: RequestUser ) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDeptInfoDto.department_id },
            select: {
                name: true,
                status: true,
            },
        });

        if(!existingDept) {
            throw new BadRequestException('Department does not exist');
        }

        const existingStat = await this.prisma.department.findFirst({
            where: { status: updateDeptInfoDto.status },
        });

        if(!existingStat === true ){
            throw new ForbiddenException('Department is still active');
        }

        const activate = await this.prisma.department.update({
            where: { id: updateDeptInfoDto.department_id },
            data: {
                status: updateDeptInfoDto.status,
            },
        });

        return {
            status: 'success',
            message: `${existingDept.name} successfully reactivated!`,
            data: activate,
        }
    }

    async getDepartments(user: RequestUser, status?: string) {
        let statusFilter: boolean | undefined;

        if (status !== undefined) {
            if (status.toLowerCase() === 'true') {
            statusFilter = true;
            } else if (status.toLowerCase() === 'false') {
            statusFilter = false;
            } else {
            throw new BadRequestException('Invalid status value. Must be "true" or "false".');
            }
        }

        const departments = await this.prisma.department.findMany({
            where: statusFilter !== undefined ? { status: statusFilter } : {},
            orderBy: { name: 'asc' },
        });

        return {
            message: 'Departments fetched successfully',
            data: departments,
        };
    }

}
