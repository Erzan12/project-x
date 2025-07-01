import { Controller, Delete, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PersonService } from './person.service';
import { DeletePersonDto } from './dto/delete-person.dto';

@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    //to be replaced with actual person name later
    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
        async deletePerson(@Body() dto: DeletePersonDto): Promise<void> {
        await this.personService.deletePersonWithRelations(dto.person_id);
    }
}
