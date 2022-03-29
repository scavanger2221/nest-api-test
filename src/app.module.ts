import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PostsModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
