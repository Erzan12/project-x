import { Controller, Post, Body, Req } from '@nestjs/common';
import { PermissionTemplateService } from './permission-template.service';
import { CreatePermissionTemplateDto } from '../dto/create-permission-template.dto';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';

@Controller('administrator')
export class PermissionTemplateController {
  constructor(private readonly service: PermissionTemplateService) {}

  @Authenticated()
  @Post('permission-templates')
  async create(@Body() dto: CreatePermissionTemplateDto, @Req() req: RequestWithUser) {
    // const created_by = req.user.id;
    return this.service.createTemplate(dto,req);
  }
}