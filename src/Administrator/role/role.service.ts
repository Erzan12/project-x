import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { AddPermissionToExistingRoleDto } from './dto/add-permission-template.dto';
import { AddPermissionToExistingUserDto } from './dto/add-permission-template.dto';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';

@Injectable()
export class RoleService {
    constructor(private prisma:PrismaService) {}

    async createRole(createRoleDto: CreateRoleDto, user) {
        const { name, description } = createRoleDto;

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

        // Flatten the actions so each action is its own object
        const flattenedRolePermissionIds = rolePermissionIds.flatMap(({ role_id, sub_module_id, module_id, action }) =>
            action.map((act) => ({
                role_id,
                sub_module_id,
                module_id,
                action: act,
            }))
        );


        const uniqueRoleIds = [...new Set(flattenedRolePermissionIds.map(rp => rp.role_id))];
        const uniqueModuleIds = [...new Set(flattenedRolePermissionIds.map(rp => rp.module_id))];

        return await this.prisma.permissionTemplate.create({
            data: {
                name,
                    company: {
                    connect: { id: company_id },
                },
                departments: {
                    create: department_ids.map(department_id => ({
                    department: { connect: { id: department_id } },
                })),
                },
                role: {
                    connect: uniqueRoleIds.map(id => ({ id })),
                },
                module: {
                    connect: uniqueModuleIds.map(id => ({ id })),
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
                    }
                })),
                },
            },
            include: {
                company: true,
                role_permissions: true,
                role: true,
                module: true,
            },
        });
    }

    async updateRolePermissions(updateRolePermissionsDto: UpdateRolePermissionsDto, user) {
        const { role_id, action_updates = [] } = updateRolePermissionsDto;

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
    async assignPermissionTemplateByRole(addPermissionTemplate:AddPermissionToExistingRoleDto) {
        const { role_ids, permission_template_id } = addPermissionTemplate;

        if (!role_ids || !permission_template_id) {
            throw new BadRequestException('Missing role_id or permission_template_id');
        }

        // 1. Fetch users with their permission_templates
        const existingUsers = await this.prisma.user.findMany({
        where: {
            user_roles: {
            some: {
                role_id: {
                in: addPermissionTemplate.role_ids, // ✅ filter users who have at least one of the given role_ids
                },
            },
            },
        },
        include: {
            permission_templates: true,
        },
        });

        console.log('Matching users:', existingUsers);
        
        console.log('Existing Users:', existingUsers);

        if (existingUsers.length === 0) {
                throw new BadRequestException('No users found for this role');
        }

        const usersAlreadyAssigned = existingUsers.filter(role =>
            role.permission_templates.some(pt => pt.id === permission_template_id)
        );

        if (usersAlreadyAssigned.length > 0) {
            const usernames = usersAlreadyAssigned.map(u => u.username).join(', ');
            throw new BadRequestException(`These users already have this template: ${usernames}`);
        }

        const existingPermissionTemplate = await this.prisma.permissionTemplate.findUnique({
            where: {id: permission_template_id},
        })

        if(!existingPermissionTemplate) {
            throw new BadRequestException('Permission Template not found')
        }
        //if data is existing in db but want to assign a role or permission just update not create
        // ✅ Step 1: Assign template to role (many-to-many)
        // await Promise.all(
        //     addPermissionTemplate.role_ids.map(roleId =>
        //         this.prisma.role.update({
        //             where: { id: roleId },
        //             data: {
        //                 permission_template: {
        //                 connect: { id: permission_template_id },
        //                 },
        //             },
        //         }),
        //     ),
        // );
        const roleUpdates = role_ids.map(roleId =>
            this.prisma.role.update({
                where: { id: roleId },
                data: {
                    permission_template: {
                        connect: { id: permission_template_id },
                    },
                },
            })
        );

        // 2. Filter out users who already have this template
        const usersToUpdate = existingUsers.filter(user =>
            !user.permission_templates.some(pt => pt.id === permission_template_id)
        );

        // 3. Add the template to those users
        // for (const user of usersToUpdate) {
        //     await this.prisma.user.update({
        //         where: { id: user.id },
        //         data: {
        //             permission_templates: {
        //                 connect: { id: permission_template_id },
        //             },
        //         },
        //     });
        // }
        const userUpdates = usersToUpdate.map(user =>
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    permission_templates: {
                        connect: { id: permission_template_id },
                    },
                },
            })
        );

        //rollback if roleUpdates fail so no update will push in db
        await this.prisma.$transaction([
            ...roleUpdates,
            ...userUpdates,
        ]);

        const updatedTemplate = await this.prisma.permissionTemplate.findUnique({
            where: { id: permission_template_id },
            include: { user: true }, // should show the users you just updated
        });

        return {
            status: 'success',
            message: `Assigned permission template to role and all users with role: ${addPermissionTemplate.role_ids}`,
            updated_data: {
                updatedTemplate
            }    
        };
    }

    async assignPermissionTemplateByUser(addPermissionTemplate: AddPermissionToExistingUserDto) {
        const { user_ids, permission_template_id } = addPermissionTemplate;

        if (!user_ids || !permission_template_id) {
            throw new BadRequestException('Missing user_id or permission_template_id');
        }

        // fetch users with their permission_templates
        const existingUsers = await this.prisma.user.findMany({
            where: {
                id: {
                    in: addPermissionTemplate.user_ids
                }
            },
            include: {
                permission_templates: true,
            },
        });

        console.log('Matching users:', existingUsers);
        
        console.log('Existing Users:', existingUsers);

        if (existingUsers.length === 0) {
            throw new BadRequestException('No users found for this template');
        }

        const usersAlreadyAssigned = existingUsers.filter(user =>
            user.permission_templates.some(pt => pt.id === permission_template_id)
        );

        if (usersAlreadyAssigned.length > 0) {
            const usernames = usersAlreadyAssigned.map(u => u.username).join(', ');
            throw new BadRequestException(`This users already have this template: ${usernames}`);
        }

        const existingPermissionTemplate = await this.prisma.permissionTemplate.findUnique({
            where: {id: addPermissionTemplate.permission_template_id},
        });

        if(!existingPermissionTemplate) {
            throw new BadRequestException('Permission Template not found')
        }

        const permissionTemplateWithRelations = await this.prisma.permissionTemplate.findUnique({
            where: { id: permission_template_id },
            include: {
                role: true,     // This must be plural or handled correctly
                module: true,
            },
        });

        if (!permissionTemplateWithRelations || !permissionTemplateWithRelations.role || !permissionTemplateWithRelations.module) {
        throw new BadRequestException('Permission Template is missing related role or module');
        }

        const role = permissionTemplateWithRelations.role?.[0];
        const module = permissionTemplateWithRelations.module?.[0];

        if (!role || !module) {
            throw new BadRequestException('Permission Template must be associated with at least one role and one module.');
        }

        // Now it's safe to access .id
        console.log('role.id:', role.id);
        console.log('module.id:', module.id);

        for (const user_id of user_ids) {

            // Optional: Check if user already has this role+module
            const existingUserRole = await this.prisma.userRole.findFirst({
                where: {
                    user_id,
                    role_id: role.id,
                    module_id: module.id,
                },
            });

            if (!existingUserRole) {
                await this.prisma.userRole.create({
                    data: {
                        user: { connect: { id: user_id } },
                        role: { connect: { id: role.id } },
                        module: { connect: { id: module.id } },
                    },
                });
            }
        }

        // Fetch permissions linked to this template
        const templatePermissions = await this.prisma.permissionTemplateRolePermission.findMany({
            where: {
                permission_template_id,
            },
            include: {
                role_permission: true,
            },
        });

        for (const user_id of user_ids) {
            // Check if UserRole exists or was just created
            const userRole = await this.prisma.userRole.findFirst({
                where: {
                    user_id,
                    role_id: role.id,
                    module_id: module.id,
                },
            });

            if (userRole) {
                const userPermissionsData = templatePermissions.map(tp => ({
                    user_id,
                    user_role_id: userRole.id,
                    user_role_permission: tp.role_permission.action,
                    role_permission_id: tp.role_permission_id,
                }));

                await this.prisma.userPermission.createMany({
                    data: userPermissionsData,
                });
            }
        }

        // checks the module to update in user 
        const module_id = module.id;

        if (!module_id) {
        throw new BadRequestException('Module ID is missing from the permission template');
        }

        // checks the role to update in user 
        const role_id = role.id;

        if (!role_id) {
        throw new BadRequestException('Module ID is missing from the permission template');
        }

        // this part is cleaner and avoids unnecessary writes
        const usersToUpdate = existingUsers.filter(user =>
            !user.permission_templates.some(pt => pt.id === permission_template_id),
        );

        await Promise.all(
            usersToUpdate.map(user =>
                this.prisma.user.update({
                where: { id: user.id },
                data: {
                    permission_templates: {
                    connect: { id: permission_template_id },
                    },
                    roles: {
                        connect: { id: role_id }
                    },
                    modules: {
                        connect: { id: module_id },
                    }
                },
                })
            )
        );

        return {
            status: 'success',
            message: `Assigned permission template to user: ${addPermissionTemplate.user_ids}`,
            update_data: {
                existingUsers
            },
        };
    }
}
