import {
  ACTION_CREATE,
  MODULE_HR,
  ACTION_DELETE,
} from '../../Auth/components/decorators/ability';
import { Controller, Delete, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PersonService } from './person.service';
import { DeletePersonDto } from './dto/delete-person.dto';
import { Can } from '../../Auth/components/decorators/can.decorator';
import { SM_HR } from 'src/Auth/components/constants/core-constants';


@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    //to be replaced with actual person name later for mapping
    @Delete()
    @Can({
            action: ACTION_DELETE,
            subject: SM_HR.EMPLOYEE_MASTERLIST,
            module: [MODULE_HR] // or MODULE_HR if it's from Admin
    })
    @HttpCode(HttpStatus.NO_CONTENT)
        async deletePerson(@Body() dto: DeletePersonDto): Promise<void> {
        await this.personService.deletePersonWithRelations(dto.person_id);
    }
}
