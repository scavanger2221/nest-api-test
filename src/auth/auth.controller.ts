import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Request() req) {
        const validatedUser = await this.authService.validateUser(req.body.user.email, req.body.user.password);
        return this.authService.login(validatedUser);
    }
    
}
