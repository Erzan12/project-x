import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
    constructor(private readonly peronService: PersonService) {}

    //to be replaced with actual person name later
    @Delete(':id')
    async deletePerson(@Param('id', ParseIntPipe) id: number) {
        await this.peronService.deletePersonSafely(id);
        return { message: `Person ${id} delete successfully.`};
    }
}
