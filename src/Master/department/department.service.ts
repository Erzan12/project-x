import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDeptInfoDto } from './dto/update-dept.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService, private createDepartmentDto: CreateDepartmentDto) {}

    async getDepartments(user: RequestUser) {
        const department = await this.prisma.department.findMany({
            include: {
                division: true,
            }
        })
        return {
            status: 'success',
            message: 'Here are the list of Departments',
            data: {
                department,
            }
        }
    }

    async createDepartment(createDepartmentDto: CreateDepartmentDto, user) {
        const { name, division_id, status } = createDepartmentDto;
        
        const existingDepartment = await this.prisma.department.findFirst({
            where: {
                name: createDepartmentDto.name,
                division_id: createDepartmentDto.division_id,
            }
        });

        if (existingDepartment) {
            throw new BadRequestException('Department already exists in this division!');
        }

        const createdDepartment = await this.prisma.department.create({
            data: {
                name: createDepartmentDto.name,
                division: {
                connect: { id: createDepartmentDto.division_id }
                },
                stat: 1
            }
        });
 
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include:{
                employee: {
                    include: {
                        person: true,
                        position: true,
                    }
                }
            }
        })

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${createdDepartment.name} Department has been created successfully!`,
            create_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            department_id: createdDepartment.id,
            department_name: createdDepartment.name
        };
    }

    async updateDeptInfo(updateDeptInfoDto: UpdateDeptInfoDto, user) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDeptInfoDto.department_id },
            select: {
                name: true,
                stat: true,
            }
        })

        if(!existingDept){
            throw new BadRequestException('Department does not exist!');
        }

        if (existingDept.stat === 0) {
            throw new ForbiddenException(`${existingDept.name} Department status is inactive!`)
        }

        const updatedDept = await this.prisma.department.update({
            where: { id: updateDeptInfoDto.department_id },
            data: {
                name: updateDeptInfoDto.department_name,  // assuming you want to change the name
                stat: updateDeptInfoDto.stat,
                //will be added to department schema updated_by and updated_at fields
                // updated_by: user.id,           // optional: if you track who updated it
                // updated_at: new Date(),        // optional: if you track timestamps
            },
        });

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include:{
                employee: {
                    include: {
                        person: true,
                        position: true,
                    }
                }
            }
        })

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${updatedDept.name} Department has been updated successfully!`,
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos
            },
            data: {
                department_id: updatedDept.id,
                department_name: updatedDept.name
            },
        };
    }

    async deactivateDept (updateDeptInfoDto: UpdateDeptInfoDto, user: RequestUser) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDeptInfoDto.department_id },
            select: {
                name: true,
                stat: true,
            },
        });

        if(!existingDept){
            throw new BadRequestException('Department does not exist!');
        }

        if (existingDept.stat === 0 && updateDeptInfoDto.stat === 0) {
            throw new ForbiddenException(`${existingDept.name} Department already deactivated`);
        }

        const deactivate = await this.prisma.department.update({
            where: { id: updateDeptInfoDto.department_id },
            data: {
                stat: updateDeptInfoDto.stat,
            }
        })

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include:{
                employee: {
                    include: {
                        person: true,
                        position: true,
                    }
                }
            }
        })

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${existingDept.name} Department has been deactivated successfully!`,
            deactivated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                department_id: deactivate.id,
                department_name: deactivate.name,
            }
        };
    }

    async reactivateDept(updateDeptInfoDto: UpdateDeptInfoDto, user: RequestUser ) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDeptInfoDto.department_id },
            select: {
                name: true,
                stat: true,
            },
        });

        if (!existingDept) {
            throw new BadRequestException('Department does not exist!');
        }

        if (existingDept.stat === 1 && updateDeptInfoDto.stat === 1) {
            throw new ForbiddenException(`${existingDept} Department is already active!`);
        }

        const activate = await this.prisma.department.update({
            where: { id: updateDeptInfoDto.department_id },
            data: {
                name: updateDeptInfoDto.department_name,
                stat: updateDeptInfoDto.stat,
            },
        });

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include:{
                employee: {
                    include: {
                        person: true,
                        position: true,
                    },
                },
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${existingDept.name} Department has been reactivated successfully!`,
            activated_by: {
                id: requestUser,
                name: userName,
                position: userPos,
            },
            data: {
                department_id: activate.id,
                department_name: activate.name
            }
        }
    }

    async getDepartmentStatus(user: RequestUser, stat?: number) {
        let statusFilter: number | undefined;

        if (stat !== undefined) {
            if (stat === 1) {
            statusFilter = 1;
            } else if (stat === 0) {
            statusFilter = 0;
            } else {
            throw new BadRequestException('Invalid status value. Must be "true" or "false".');
            }
        }

        const departments = await this.prisma.department.findMany({
            where: statusFilter !== undefined ? { stat: statusFilter } : {},
            orderBy: { name: 'asc' },
        });

        return {
            status: 'success',
            message: 'Departments status fetched successfully!',
            data: {
                departments
            }
        };
    }
}
