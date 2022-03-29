import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
     return 'This action returns all cats';
  }

  @Get('/test')
  getTest(): string {
    return 'This action returns all cats';
  }

}
