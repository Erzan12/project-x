import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePermissionTemplateDto } from '../dto/create-permission-template.dto';


@Injectable()
export class PermissionTemplateService {
    constructor(private prisma: PrismaService) {}

  async createTemplate(createPermissionTemplateDto: CreatePermissionTemplateDto, req) {
    console.log('DTO Received:', createPermissionTemplateDto);
    
    const { name, departmentId, companyIds, rolePermissionIds } = createPermissionTemplateDto;
    
    //check for role administrator
    const roleUser = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: { role: true },
    });

    if (!roleUser) {
      throw new ForbiddenException('User not authenticated');
    }

    if (roleUser.role?.name !== 'Administrator') {
      throw new ForbiddenException('Only Administrators are allowed to create permission templates');
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
}
