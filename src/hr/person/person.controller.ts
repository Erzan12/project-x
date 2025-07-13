import { Controller, Delete, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PersonService } from './person.service';
import { DeletePersonDto } from './dto/delete-person.dto';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/can.decorator';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';
import { Can } from '../../Auth/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  SM_EMPLOYEE_MASTERLIST,
  MODULE_HR,
  MODULE_ACCOUNTING,
  ACTION_DELETE,
} from '../../Auth/components/decorators/ability.enum';


@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    //to be replaced with actual person name later for mapping
    @Delete()
    @Can({
            action: ACTION_DELETE,
            subject: SM_EMPLOYEE_MASTERLIST,
            module: [MODULE_HR] // or MODULE_HR if it's from Admin
    })
    @HttpCode(HttpStatus.NO_CONTENT)
        async deletePerson(@Body() dto: DeletePersonDto): Promise<void> {
        await this.personService.deletePersonWithRelations(dto.person_id);
    }
}
