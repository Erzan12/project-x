import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePermissionTemplateDto } from '../dto/create-permission-template.dto';


@Injectable()
export class PermissionTemplateService {
    constructor(private prisma: PrismaService) {}

  async createTemplate(dto: CreatePermissionTemplateDto, req) {
    console.log('DTO Received:', dto);
    
    const { name, departmentId, companyIds, rolePermissionIds } = dto;
    
    //check for role administrator
    const roleUser = req.user

    if(!roleUser) {
        throw new ForbiddenException('User not authenticated');
    }

    if(roleUser.role !== 'Administrator') {
        throw new ForbiddenException('Only Administrators are allowed to create permission templates')
    }
    
    console.log('company_ids:', companyIds);

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
          create: rolePermissionIds.map(({ role_id, permission_id, module_id }) => ({
            role_permission: {
              connect: {
                role_id_permission_id_module_id: {
                  role_id,
                  permission_id,
                  module_id,
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
