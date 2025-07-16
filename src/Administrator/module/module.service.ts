import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ModuleService {
    constructor(private prisma: PrismaService) {}
        // validate if module already exist
        async createModule(createModuleDto: CreateModuleDto, user) { 
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
    
        const module = await this.prisma.module.findFirst({
            where : { name: createModuleDto.name }
        })
        if (module) {
            throw new BadRequestException('Username or Email address already exist!');
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
}
