import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), TweetModule, UserModule]
})
export class AppModule { }
