import { BadRequestException, ConflictException, UnauthorizedException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModuleDto } from './module/dto/create-module.dto';
import { CreateSubModuleDto } from './sub_module/dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './sub_module/dto/create-sub-module-permissions.dto';
import { CreatePermissionTemplateDto } from './role/dto/create-permission-template.dto';
import { CreateRoleDto } from './role/dto/create-role.dto';
import { CreateRolePermissionDto } from './role/dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './role/dto/update-role-permissions.dto';
import { UserRole } from 'src/Auth/components/decorators/ability';
import { AddPermissionToExistingUserDto } from './role/dto/add-permission-template-existing-user-dto';

@Injectable()
export class AdministratorService {
    constructor (private prisma: PrismaService) {}

}