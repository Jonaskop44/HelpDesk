import type { AppConfigService } from '../config/app-config/app-config.service.js';
import type { PrismaService } from '../config/prisma/prisma.service.js';
import { createAuth } from './auth.factory.js';

export const auth = createAuth({
  prisma: {} as PrismaService,
  config: {} as AppConfigService,
});
