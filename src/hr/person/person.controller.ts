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


    // @Delete(':employee_id/:person_id/:user_id')
    // async deletePerson(
    //     @Param('employee_id', ParseIntPipe) employee_id: number,
    //     @Param('person_id', ParseIntPipe) person_id: number,
    //     @Param('user_id', ParseIntPipe) user_id: number,
    // ) {
    //     await this.personService.deletePersonSafely(employee_id, person_id, user_id);
    //     return { message: `Person ${person_id} deleted successfully.` };
    // }
}
