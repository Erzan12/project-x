import { Controller, Delete, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { DeletePersonDto } from './dto/delete-person.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesPermissionsGuard } from 'src/auth/guards/roles-permissions.guard';
import { Roles } from 'src/auth/components/decorators/roles.decorator';
import { Permissions } from 'src/auth/components/decorators/permissions.decorator';

@Controller('person')
@UseGuards(AuthGuard('jwt'), RolesPermissionsGuard)
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    //to be replaced with actual person name later
    @Delete()
    @Roles('Human Resources')
    @Permissions('Edit Employee')
    @HttpCode(HttpStatus.NO_CONTENT)
        async deletePerson(@Body() dto: DeletePersonDto): Promise<void> {
        await this.personService.deletePersonWithRelations(dto.person_id);
    }
}
