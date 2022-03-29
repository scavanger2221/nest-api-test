import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {email: email},
          });
    }

}
