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

    async create(data:{
        email:string,
        password:string,
        name?:string,
        surname?:string,
    }): Promise<User> {
        return this.prisma.user.create({
            data: {
                ...data,
            },
        });
    }
}
