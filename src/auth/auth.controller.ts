import {Body,Controller,Get,HttpCode,HttpStatus,Post,Req,Res,UseGuards,} from '@nestjs/common';
import { Request, Response} from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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

            res.setHeader('x-access-token', accessToken);

            res.setHeader('x-refresh-token', refreshToken);

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

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() data: RegisterDto, @Res() res: Response) 
    {
        const user = await this.authService.register(data);
        if (user) {
            return res.jsonp({
                message: 'User created successfully',
                status: 'success',
                data: user,
            });
        }
    }
}
