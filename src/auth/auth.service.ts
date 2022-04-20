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
        return {
            accessToken: this.createAccessToken(user),
            refreshToken: this.createRefreshToken(user),
        };
    }

    public async register(email: string, pass: string): Promise<any> {

    }

    public async getUser(token:string): Promise<any> {

    }

    public createAccessToken (user:User): string {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    public createRefreshToken(user:User): string {
        return this.jwtService.sign({sub: user.id, email:user.email}, {expiresIn: '1w', secret:  Buffer.from(jwtConstants.refreshTokenSecret + user.password).toString('base64')});
    }
}

