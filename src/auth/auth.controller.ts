import {Body,Controller,Get,HttpCode,HttpStatus,Post,Req,Res,UseGuards,} from '@nestjs/common';
import { Request, Response} from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                //max age is set to 10 minute
                maxAge: 10 * 60 * 1000,
            });

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                //max age is set to 1 week
                maxAge: 100 * 60 * 24 * 7,
            });

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
