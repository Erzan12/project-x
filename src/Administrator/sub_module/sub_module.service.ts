import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UnassignSubmodulePermissionsDto } from './dto/unassign-submodule.dto';

@Injectable()
export class SubModuleService {
    constructor(private prisma: PrismaService) {}

    async createSubModule(createSubModuleDto: CreateSubModuleDto, user) {
    //check for role administrator -> role authentication will happen in casl ability service
    // const user = await this.prisma.user.findUnique({
    //     where: { id: req.user.id},
    //     include: {
    //         role: true,
    //     }
    // })

    // if(!user || user.role?.name !== UserRole.ADMINISTRATOR ) {
    //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
    // }

    const findModule = await this.prisma.module.findUnique({
        where: { id: createSubModuleDto.module_id }
    })
    if(!findModule){
        throw new BadRequestException('Module not found!')
    }

    const creator = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: {
            employee: {
                include: {
                    person: true,
                },
            },
        },
    });

    if (!creator || !creator.employee || !creator.employee.person) {
        throw new BadRequestException(`Creator ${creator?.employee.position_id} information not found.`);
    }
    const admin = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
    const adminPosition = creator.employee.position_id;

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
            },
        subModule_id: subModule.id,
        subModule_name: subModule.name
    }
    }

    async createSubModulePermissions(createSubModulePermissionsDto: CreateSubModulePermissionDto, user) {
    //shortcut the createSubModulePermissionsDto will not be called again upon create
    const { action, sub_module_id } = createSubModulePermissionsDto;

    //check for role administrator -> role authentication will happen in casl ability service
    // const user = await this.prisma.user.findUnique({
    //     where: { id: req.user.id},
    //     include: {
    //         role: true,
    //     }
    // })

    // if(!user || user.role?.name !== UserRole.ADMINISTRATOR ) {
    //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
    // }

    const subModulePermissions = await this.prisma.subModule.findFirst({
        where: { id: createSubModulePermissionsDto.sub_module_id },
    })

    if (!subModulePermissions) {
        throw new BadRequestException('Sub-Module not found!');
    }

    const creator = await this.prisma.user.findUnique({
        where: { id: user.id },
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
        throw new BadRequestException(`Creator ${creator?.employee.position_id} information not found.`);
    }
    const admin = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
    const adminPosition = creator.employee.position_id;

    const subModule = action.map(act =>({
        action: act,
        sub_module_id,
    }));

    const result = await this.prisma.subModulePermission.createMany({
        data: subModule,
        skipDuplicates: true, // optional, avoids duplicate entries
    });

    const moduleName = this.prisma.subModulePermission.findFirst({
        where: { id: subModulePermissions.module_id },
        include: {
            sub_module: {
                include: {
                    module: true,
                }
            }
        }
    })

    return {
        status: 'success',
        message: `Added permissions to Sub Module ${moduleName.sub_module.name}`,
        created_by: {
                id: creator.id,
                name: admin,
                position: adminPosition,
            },
        data: {
            result
        }
    }   
    }

    async unassignSubmodulePermissions(unassignSubmodulePermissionsDto: UnassignSubmodulePermissionsDto, user) {
        const { sub_module_id, sub_module_permission_id } = unassignSubmodulePermissionsDto;

        const existingSubModule= await this.prisma.subModule.findFirst({
            where: { id: unassignSubmodulePermissionsDto.sub_module_id },
        });

        if (!existingSubModule){
            throw new BadRequestException('Selected Sub Module does not exist');
        }

        const existingSubModulePermission = await this.prisma.subModulePermission.findMany({
            where: { id: {
                in: unassignSubmodulePermissionsDto.sub_module_permission_id
            },
        },
        });

        if(!existingSubModulePermission){
            throw new BadRequestException('Selected Sub Module Permissions does not exist');
        };

        const unassignSubmodulePermissions = await this.prisma.subModulePermission.updateMany({
            where: {
                id: {
                    
                }
            },
            data: {
                status: false,
            }
        })
    }
}
