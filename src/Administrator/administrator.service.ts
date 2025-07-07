import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { permission } from 'process';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { PermissionTemplateService } from './permission-template/permission-template.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class AdministratorService {
    constructor (private prisma: PrismaService, private permissionTemplateService:PermissionTemplateService) {}

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

        async createRole(createRoleDto: CreateRoleDto, req, created_by: number) {
            const { name, description } = createRoleDto;

            //check for role administrator
            const roleUser = req.user

            if(!roleUser) {
                throw new ForbiddenException('User not authenticated');
            }

            // if(roleUser.id !== 'Administrator') {
            //     throw new ForbiddenException('Only Administrators are allowed to create permission templates')
            // }

            const roleX = await this.prisma.role.findUnique({
                where: { name: createRoleDto.name }
            })

            // if(roleX){
            //     throw new BadRequestException('Role already exist! Try again')
            // }

            const roleCreate = await this.prisma.role.create({
                data: {
                    name,
                    description,
                }
            })

            return {
                status: 'success',
                message: `Role successfully created!}`,
                created_by: {
                    id: roleUser.id,
                    name: roleUser.user.name,
                    posistion: roleUser.name,
                },
                data: {
                    roleCreate
                }
            }
        }

        async createRolePermissions(createRolePermissionDto: CreateRolePermissionDto, req, created_by) {
            const { action, permission_id, module_id, role_id } = createRolePermissionDto;

            const roleUser = req.user

            if(!roleUser) {
                throw new ForbiddenException('User not authenticated');
            }

            const rolePermissions = await this.prisma.role.findFirst({
                where: { id: createRolePermissionDto.role_id },
            })

            if(!rolePermissions) {
                throw new BadRequestException('Role not found!')
            }

            const moduleID = await this.prisma.module.findUnique({
                where: { id: module_id},
            });

            if(!moduleID) {
                throw new BadRequestException('Module not found!')
            }

            const subID = await this.prisma.subModule.findUnique({
                where: { id: permission_id}
            })

            if(!subID) {
                throw new BadRequestException('Sub Module not found!')
            }

            const createRolePermission = action.map(act =>({
                action: act,
                permission_id,
                module_id,
                role_id,
            }))

            return this.prisma.rolePermission.createMany({
                data: createRolePermission,
                skipDuplicates: true,
            });
        }


        // async createPermissionTemplate(createPermissionTemplateDto: CreatePermissionTemplateDto, req) {
        //     const { name, department_id, company_ids, role_permissions_ids } = createPermissionTemplateDto;

        //     //validator and authenticator if the current user is admin if not user is not allowed to create permission template
        //     const roleUser = req.user

        //     if(!roleUser) {
        //         throw new ForbiddenException('User not authenticated');
        //     }

        //     if(roleUser.role !== 'Administrator') {
        //         throw new ForbiddenException('Only Administrators are allowed to create permission templates')
        //     }

        //     const newTemplate = company_ids.map(company_id =>({
        //         name,
        //         department_id,
        //         company_id,
        //         role_permissions_ids,
        //         createdBy: roleUser.role.name,
        //     }));

        //     // exampl if admin creates and save new templates assuming a bulk insert function exist
        //     await this.permissionTemplateService.createMany(newTemplate);

        //     return newTemplate;
        // }
}