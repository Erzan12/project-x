import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { permission } from 'process';

@Injectable()
export class AdministratorService {
    constructor (private prisma: PrismaService) {}

        // validate if module already exist
        async createModule(createModuleDto: CreateModuleDto, created_by: number) { 
            const module = await this.prisma.module.findFirst({
                where : { name: createModuleDto.name }
            })
            if (module) {
                throw new BadRequestException('Username or Email address already exist!');
            }

            const creator = await this.prisma.user.findUnique({
                where: { id: created_by },
                include: {
                    employee: {
                        include: {
                            person: true,
                        },
                    },
                },
            });
           
            if (!creator || !creator.employee || !creator.employee.person) {
                throw new BadRequestException(`Creator ${creator?.employee.position} information not found.`);
            }
            const admin = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
            const adminPosition = creator.employee.position;

            const moduleCreate = await this.prisma.module.create({
                data: {
                    name: createModuleDto.name,
                }
            })

            return {
                status: 'success',
                message: `New module has been added to the system!`,
                created_by: {
                    id: creator.id,
                    name: admin,
                    position: adminPosition,
                },
                module_id: moduleCreate.id,
                module_name: moduleCreate.name
            }
        }
    
        async createSubModule(createSubModuleDto: CreateSubModuleDto, created_by: number) {
            const module = await this.prisma.subModule.findFirst({
                where: { id: createSubModuleDto.module_id }
            })
            if(!module){
                throw new BadRequestException('Module not found!')
            }

            const creator = await this.prisma.user.findUnique({
                where: { id: created_by },
                include: {
                    employee: {
                        include: {
                            person: true,
                        },
                    },
                },
            });

            if (!creator || !creator.employee || !creator.employee.person) {
                throw new BadRequestException(`Creator ${creator?.employee.position} information not found.`);
            }
            const admin = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
            const adminPosition = creator.employee.position;

            // const moduleName = await this.prisma.module.findFirst({
            //     where: { name: module.name}
            // })

            const subModule = await this.prisma.subModule.create({
                data: {
                    name: createSubModuleDto.name,
                    module_id: createSubModuleDto.module_id
                },
                include: {
                    module: true,
                }
            })

            return {
                status: 'success',
                message: `Sub Module for Module ${subModule.module.name} has been added`,
                created_by: {
                        id: creator.id,
                        name: admin,
                        position: adminPosition,
                subModule_id: subModule.id,
                subModule_name: subModule.name
                }
            }
        }

        async createSubModulePermissions(createSubModulePermissionsDto: CreateSubModulePermissionDto, created_by: number) {
            //shortcut the createSubModulePermissionsDto will not be called again upon create
            const { action, sub_module_id } = createSubModulePermissionsDto;
            
            const subModulePermissions = await this.prisma.subModule.findFirst({
                where: { id: createSubModulePermissionsDto.sub_module_id },
            })

            if (!subModulePermissions) {
                throw new BadRequestException('Sub-Module not found!');
            }

            const creator = await this.prisma.user.findUnique({
                where: { id: created_by },
                include: {
                    employee: {
                        include: {
                            person: true,
                        },
                    },
                },
            });

            //to call the user who created the submodule
            if (!creator || !creator.employee || !creator.employee.person) {
                throw new BadRequestException(`Creator ${creator?.employee.position} information not found.`);
            }
            const admin = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
            const adminPosition = creator.employee.position;

            const subModule = action.map(act =>({
                action: act,
                sub_module_id,
            }));

            return this.prisma.subModulePermission.createMany({
                data: subModule,
                skipDuplicates: true, // optional, avoids duplicate entries
            });
        }
}