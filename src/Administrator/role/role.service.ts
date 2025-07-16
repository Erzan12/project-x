import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { AddPermissionToExistingUserDto } from './dto/add-permission-template-existing-user-dto';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';

@Injectable()
export class RoleService {
    constructor(private prisma:PrismaService) {}

    async createRole(createRoleDto: CreateRoleDto, user) {
    const { name, description } = createRoleDto;

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

    const requestUser = user.id

    return {
        status: 'success',
        message: `Role have been successfully created!}`,
        created_by: {
            id: createdRole.id,
            role: requestUser.role?.name
        },
        createdRole
    }
    }

    async createRolePermissions(createRolePermissionDto: CreateRolePermissionDto, user) {
    const { action, sub_module_id, module_id, role_id } = createRolePermissionDto;

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
        where: { id: user.id },
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

    async createPermissionTemplate(createPermissionTemplateDto: CreatePermissionTemplateDto, user) {
    console.log('DTO Received:', createPermissionTemplateDto);

    const { name, department_ids, company_id, rolePermissionIds } = createPermissionTemplateDto;

    // //check for role administrator -> role authentication will happen in casl ability service
    // const user = await this.prisma.user.findUnique({
    //     where: { id: req.user.id},
    //     include: {
    //         role: true,
    //     }
    // })

    // if(!user || user.role?.name !== UserRole.ADMINISTRATOR ) {
    //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
    // }

    console.log('company_ids:', company_id);

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
        // name,
        // department_id: departmentId, // to be check if is it okay to add a manager or any role, for role permission template to multiple depts.
        // companies: {
        // //array to add multiple companies
        // create: companyIds.map((company_id) => ({
        //     company: { connect: { id: company_id } },
        // })),
        // },
        name,
        company: {
            connect: { id: createPermissionTemplateDto.company_id },
        },
        departments:  {
        //array to add multiple companies
            create: createPermissionTemplateDto.department_ids.map((department_id) => ({
                department: { connect: { id: department_id } },
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
            }
            }
        },
        })),
    },
        // created_by,
    },
        include: {
            company: true,
            role_permissions: true,
        },

    });
    }

    async updateRolePermissions(updateRolePermissionsDto: UpdateRolePermissionsDto, user) {
    const { role_id, action_updates = [] } = updateRolePermissionsDto;

    //check for role administrator -> role authentication will happen in casl ability service
    // const user = await this.prisma.user.findUnique({
    //     where: { id: req.user.id},
    //     include: {
    //         role: true,
    //     }
    // })

    // if(!user || user.role?.name !== 'Administrator' ) {
    //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
    // }

    const existingRole = await this.prisma.role.findUnique({
        where: { id: role_id },
        include: {
        role_permissions: true,
        },
    });

    if (!existingRole) {
        throw new BadRequestException('Role does not exist!');
    }

    if(existingRole.role_permissions.length === 0) {
        throw new BadRequestException('This role has no existing role to update');
    }

    const toUpdate = existingRole.role_permissions.filter((perm) =>
        action_updates.some(update => update.currentAction === perm.action)
    );

    const results = await Promise.all(
        toUpdate.map((perm) => {
            const updateData = action_updates.find(u => u.currentAction === perm.action);
            
            if (!updateData) {
                throw new ForbiddenException('Updating action failed')
            }

            return this.prisma.rolePermission.update({
                where: { id: perm.id },
                data: {
                    action: updateData.newAction,
                },
            });
        })
    );

    return results;
    }

    //unassing currently selected role permission
    async unassignRolePermission(unassignRolePermissionDto: UnassignRolePermissionDto, user) {
        const { sub_module_id, role_permission_id } = unassignRolePermissionDto;

        const existingSubModule = await this.prisma.subModule.findFirst({
            where: { id: unassignRolePermissionDto.sub_module_id },
            include: {
                role_permission: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if(!existingSubModule){
            throw new BadRequestException('Selected Sub Module does not exist');
        }

        const existingRolePermission = await this.prisma.rolePermission.findMany({
            where: { id: {
                in: unassignRolePermissionDto.role_permission_id
                },
            },
        });

        if(!existingRolePermission){
            throw new BadRequestException('Selected Role Permission does not exist in this Sub Module');
        };
        
        const unassignedRolePermission = await this.prisma.rolePermission.updateMany({
            where: {
                id: {
                    in: unassignRolePermissionDto.role_permission_id,
                },
                sub_module_id: unassignRolePermissionDto.sub_module_id,
                status: true, // Only update active assignments
            },
            data: {
                status: false, // Mark as unassigned
            },
        });

        return {
            status: 'success',
            message: 'You have successfuly update a role permission',
            updated_by: {
                    User: user.role.name
                },  
            data: {
                unassignedRolePermission
            },
        };
    }

    //assigning permission template to user who doesnt have a permission yet
    async assignPermissionTemplate(addPermissionTemplate:AddPermissionToExistingUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: addPermissionTemplate.user_id},
            include: {
                person: true,
                permission_template: true,
            },
        })

        if(!existingUser) {
            throw new BadRequestException('User not found')
        }

        const existingPermissionTemplate = await this.prisma.permissionTemplate.findUnique({
            where: {id: addPermissionTemplate.permission_template_id},
        })

        if(!existingPermissionTemplate) {
            throw new BadRequestException('Permission Template not found')
        }
        //if data is existing in db but want to assign a role or permission just update not create
        await this.prisma.user.update({
            where: { id: addPermissionTemplate.user_id },
            data: {
                permission_template_id: addPermissionTemplate.permission_template_id,
            },
        });

        return {
            status: 'success',
            message: `Added Permission Template to user ${existingUser.person?.first_name ?? existingUser.id} ${existingUser.person?.last_name ?? existingUser.id}`
        }
    }
}
