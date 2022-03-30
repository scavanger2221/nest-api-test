import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    
    async login(user:User): Promise<{accessToken:string, refreshToken:string}> {
        const payload = { email: user.email, sub: user.id };
        
        const refreshToken = this.createRefreshToken(user);

        //set user refresh token expire in 1 week
        await this.usersService.setRefreshToken(user, refreshToken);
        
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: refreshToken,
        };
    }

    public async register(email: string, pass: string): Promise<any> {

    }

    public async getUser(token:string): Promise<any> {

    }

    private createRefreshToken(user:User): string {
        return this.jwtService.sign({user: user.id, email: user.email}, {expiresIn: '1w', secret: jwtConstants.refreshTokenSecret}); 
    }
}

