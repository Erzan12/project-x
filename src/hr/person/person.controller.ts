import { Controller, Delete, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PersonService } from './person.service';
import { DeletePersonDto } from './dto/delete-person.dto';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';

@Controller('person')
@Authenticated()
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    //to be replaced with actual person name later for mapping
    @Delete()
    @Roles('Human Resources')
    @Permissions('Edit Employee')
    @HttpCode(HttpStatus.NO_CONTENT)
        async deletePerson(@Body() dto: DeletePersonDto): Promise<void> {
        await this.personService.deletePersonWithRelations(dto.person_id);
    }
}
