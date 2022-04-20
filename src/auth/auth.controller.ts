import {Body,Controller,Get,HttpCode,HttpStatus,Post,Req,Res,UseGuards,} from '@nestjs/common';
import { Request, Response} from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const validatedUser = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        if (validatedUser) {
            const { accessToken, refreshToken } = await this.authService.login(
                validatedUser,
            );

            res.header('x-access-token', accessToken);

            res.header('x-refresh-token', refreshToken);

            return res.jsonp({
                message: 'Login Successful',
                status: 'success',
            });
        }

        return res.status(HttpStatus.UNAUTHORIZED).json({
             message: 'Invalid credentials', 
             status:'error'
            });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request) {
        return req.user;
    }
}
