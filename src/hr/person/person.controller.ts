import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    //to be replaced with actual person name later
    // @Delete(':id')
    // async deletePerson(@Param('id', ParseIntPipe) id: string, id: number) {
    //     await this.personService.deletePersonSafely(id,id,id);
    //     return { message: `Person ${id} delete successfully.`};
    // }

    @Delete(':employee_id/:person_id/:user_id')
    async deletePerson(
        @Param('employee_id', ParseIntPipe) employee_id: number,
        @Param('person_id', ParseIntPipe) person_id: number,
        @Param('user_id', ParseIntPipe) user_id: number,
    ) {
        await this.personService.deletePersonSafely(employee_id, person_id, user_id);
        return { message: `Person ${person_id} deleted successfully.` };
    }
}
