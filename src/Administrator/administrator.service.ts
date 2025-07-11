import { BadRequestException, ConflictException, UnauthorizedException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { Role } from 'src/Auth/components/decorators/global.enums';

@Injectable()
export class AdministratorService {
    constructor (private prisma: PrismaService) {}

    // validate if module already exist
    async createModule(createModuleDto: CreateModuleDto, req, created_by: number) { 
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
        throw new BadRequestException(`Creator ${creator?.employee.position_id} information not found.`);
    }
    const admin = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
    const adminPosition = creator.employee.position_id;

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

    async createSubModule(createSubModuleDto: CreateSubModuleDto, req, created_by: number) {
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

    const findModule = await this.prisma.module.findUnique({
        where: { id: createSubModuleDto.module_id }
    })
    if(!findModule){
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

    async createSubModulePermissions(createSubModulePermissionsDto: CreateSubModulePermissionDto, req, created_by: number) {
    //shortcut the createSubModulePermissionsDto will not be called again upon create
    const { action, sub_module_id } = createSubModulePermissionsDto;

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

    async createRole(createRoleDto: CreateRoleDto, req, created_by: number) {
    const { name, description } = createRoleDto;

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

    const role = await this.prisma.role.findUnique({
        where: { name: createRoleDto.name }
    })

    if(role){
        throw new BadRequestException('Role already exist! Try again')
    }

    const createdRole = await this.prisma.role.create({
        data: {
            name,
            description,
        }
    })

    return {
        status: 'success',
        message: `Role have been successfully created!}`,
        created_by: {
            id: createdRole.id,
            role: user.role.name
        },
        createdRole
    }
    }

    async createRolePermissions(createRolePermissionDto: CreateRolePermissionDto, req, created_by) {
    const { action, sub_module_id, module_id, role_id } = createRolePermissionDto;

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

    const rolePermissions = await this.prisma.role.findFirst({
        where: { id: createRolePermissionDto.role_id },
    })

    if(!rolePermissions) {
        throw new BadRequestException('Role not found or does not exist!')
    }

    const moduleID = await this.prisma.module.findUnique({
        where: { id: module_id},
    });

    if(!moduleID) {
        throw new BadRequestException('Module not found or does not exist!')
    }

    const subID = await this.prisma.subModule.findUnique({
        where: { id: sub_module_id}
    })

    if(!subID) {
        throw new BadRequestException('Sub Module not found or does not exist!')
    }

    const createRolePermission = action.map(act =>({
        action: act,
        sub_module_id,
        module_id,
        role_id,
    }))

    const result = await this.prisma.rolePermission.createMany({
        data: createRolePermission,
        skipDuplicates: true,
    });

    const rolePermission = await this.prisma.role.findFirst({
        where: { id: role_id },
    })

    const creatorUser = await this.prisma.user.findFirst({
        where: { id: req.user.name },
    })

    return {
        status: 'success',
        message: `Added permissions to Role ${rolePermission?.name}`,
        created_by: {
            id: creatorUser?.id,
            name: creatorUser?.username
        },
        result
    }
    }

    async createPermissionTemplate(createPermissionTemplateDto: CreatePermissionTemplateDto, req) {
    console.log('DTO Received:', createPermissionTemplateDto);

    const { name, departmentId, companyIds, rolePermissionIds } = createPermissionTemplateDto;

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

    console.log('company_ids:', companyIds);

    // Flatten the actions so each action is its own object
    const flattenedRolePermissionIds = rolePermissionIds.flatMap(({ role_id, sub_module_id, module_id, action }) =>
    action.map((act) => ({
        role_id,
        sub_module_id,
        module_id,
        action: act,
    }))
    );


    return await this.prisma.permissionTemplate.create({
    data: {
        name,
        department_id: departmentId,
        companies: {
        //array to add multiple companies
        create: companyIds.map((company_id) => ({
            company: { connect: { id: company_id } },
        })),
        },
        
    role_permissions: {
        create: flattenedRolePermissionIds.map(({ role_id, sub_module_id, module_id, action }) => ({
        role_permission: {
            connect: {
            role_id_sub_module_id_module_id_action: {
                role_id,
                sub_module_id,
                module_id,
                action,
            },
            },
        },
        })),
    },
        // created_by,
    },
    include: {
        companies: true,
        role_permissions: true,
    },

    });

    }

    async updateRolePermissions(updateRolePermissionsDto: UpdateRolePermissionsDto, req) {
    const { role_id, action = [] } = updateRolePermissionsDto;

    //check for role administrator
    const user = await this.prisma.user.findUnique({
        where: { id: req.user.id},
        include: {
            role: true,
        }
    })

    if(!user || user.role?.name !== 'Administrator' ) {
        throw new ForbiddenException('Only Administrators are allowed to create permission templates')
    }

    const existingRole = await this.prisma.role.findUnique({
        where: { id: role_id },
        include: {
        role_permissions: true,
        },
    });

    if (!existingRole) {
        throw new BadRequestException('Role does not exist!');
    }

    const toUpdate = existingRole.role_permissions.filter((perm) =>
        action.includes(perm.action)
    );

    const results = await Promise.all(
        toUpdate.map((perm) =>
        this.prisma.rolePermission.update({
            where: { id: perm.id },
            data: {
            // Add fields you want to update here, e.g.:
            action: perm.action, // or any new action value
            },
        })
        )
    );

    if (existingRole.role_permissions.length === 0) {
        throw new BadRequestException('This role has no existing permissions to update.');
    }

    return results;
    }
}