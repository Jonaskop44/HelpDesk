import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation.js';
import { PrismaModule } from './config/prisma/prisma.module.js';
import { AppConfigModule } from './config/app-config/app-config.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    AppConfigModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
