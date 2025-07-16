import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/Mail/mail.service';

@Injectable()
export class ManagerService {
    constructor (private readonly prisma: PrismaService, private readonly mailService: MailService, ) {}

    // async createUserEmployee(createUserWithTemplateDto: CreateUserWithTemplateDto, req) {
    // }
}

