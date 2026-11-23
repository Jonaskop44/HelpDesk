import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { AppConfigService } from '../config/app-config/app-config.service.js';
import { PrismaService } from '../config/prisma/prisma.service.js';
import { createAuth } from './auth.factory.js';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      inject: [PrismaService, AppConfigService],
      useFactory: (prisma: PrismaService, config: AppConfigService) => ({
        auth: createAuth({ prisma, config }),
      }),
    }),
  ],
})
export class AuthModule {}
