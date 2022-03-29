import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {

    constructor() { }
    
    @Get()
    findAll(): string {
        return 'This action returns all users';
    }

}
