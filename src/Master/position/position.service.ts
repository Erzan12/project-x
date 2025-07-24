import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { UpdateDeptInfoDto } from '../department/dto/update-dept.dto';

@Injectable()
export class PositionService {
    constructor(private prisma: PrismaService, private createPositionDto: CreatePositionDto) {}

    async getPosition(user: RequestUser) {
        const position = await this.prisma.position.findMany({
            include: {
                department: true,
            }
        })
        return {
            status: 'success',
            message: 'Here are the list of Positions',
            data: {
                position
            }
        }
    }

    async createPosition(createPositionDto: CreatePositionDto, user: RequestUser) {
        const { name, department_id, status } = createPositionDto;

        // //check for role administrator
        // const user = await this.prisma.user.findUnique({
        //     where: { id: req.user.id},
        //     include: {
        //         role: true,
        //     }
        // })
    
        // if(!user || user.role?.name !== UserRole.ADMINISTRATOR ) {
        //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
        // }

        const existingPosition = await this.prisma.position.findFirst({
            where: { name: createPositionDto.name },
            include: {
                department: true,
            }
        })

        if(existingPosition) {
            throw new ConflictException('Position already exist! Try again!')
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
            message: `${createdPosition.name} Position has been created successfully!`,
            data: {
                createdPosition,
            },
        };
    }

    async updatePosition(updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const { position_id, position_name, department_id, status } = updatePositionDto;

        const existingPosition = await this.prisma.position.findUnique({
            where: { id: updatePositionDto.position_id }
        });

        if(!existingPosition){
            throw new BadRequestException('Position not found!');
        }

        // const existingDept = await this.prisma.department.findUnique({
        //     where: { id: updatePositionDto.department_id }
        // });

        if (updatePositionDto.department_id !== undefined) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updatePositionDto.department_id },
        });

        if (!existingDept) {
            throw new BadRequestException('Department not found!');
        }
        }

        // if(!existingDept){
        //     throw new BadRequestException('Department does not exist');
        // }

        // const checkStat = await this.prisma.position.findUnique({
        //     where: { id: updatePositionDto.position_id },
        //     select: {
        //         status: true,
        //     },
        // })
        // if(checkStat === false)

        const updatePositionInfo = await this.prisma.position.update({
            where: { id: updatePositionDto.position_id },
            data: {
                id: existingPosition.id,
                name: position_name,
                department_id,
                status,
            },
        });

        return {
            status: 'success',
            message: `${existingPosition.name} Position has been updated Successfully!`,
            data: {
                updatePositionInfo
            },
        }
    }

    async deactivatePos (updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const existingPos = await this.prisma.position.findUnique({
            where: { id: updatePositionDto.position_id },
            select: {
                name: true,
                status: true,
            },
        });

        if(!existingPos) {
            throw new BadRequestException('Position does not exist!');
        }

        const currentStat = await this.prisma.position.findFirst({
            where: { status: existingPos.status },
        });

        if(!currentStat === true){
            throw new ForbiddenException('Position is still active!');
        }

        const deactivate = await this.prisma.position.update({
            where: { id: updatePositionDto.position_id },
            data: {
                status: updatePositionDto.status,
            },
        });

        return {
            status: 'success',
            message: `${existingPos.name} Position has been deactivated successfully!`,
            data: {
                deactivate
            },
        }
    }

    async reactivatePos(updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const existingPos = await this.prisma.position.findUnique({
            where: { id: updatePositionDto.department_id },
            select: {
                name: true,
                status: true,
            },
        });

        if(!existingPos) {
            throw new BadRequestException('Position does not exist!');
        }

        const existingStat = await this.prisma.position.findFirst({
            where: { status: updatePositionDto.status },
        });

        if(!existingStat === true ){
            throw new ForbiddenException('Position is already active!');
        }

        const activate = await this.prisma.position.update({
            where: { id: updatePositionDto.position_id },
            data: {
                name: updatePositionDto.position_name,
                status: updatePositionDto.status,
            },
        });

        return {
            status: 'success',
            message: `${existingPos.name} Position has been reactivated successfully!`,
            data: {
                activate
            },
        }
    }
}
