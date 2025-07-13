import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('protected')
export class ProtectedController {
  @Get('authorized-only')

  getHrData() {
    return { message: 'Authorize Access Granted' };
  }
}
