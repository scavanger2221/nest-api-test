import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
