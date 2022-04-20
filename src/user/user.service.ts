import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {id: id},
          });
    }

    // async setRefreshToken(user:User, refreshToken:string): Promise<User | null> {
    //     return this.prisma.user.update({
    //         where: {id: user.id},
    //         data: {refreshToken: refreshToken},
    //     });

    // }
}
