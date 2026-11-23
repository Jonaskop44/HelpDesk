import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, openAPI } from 'better-auth/plugins';
import type { AppConfigService } from '../config/app-config/app-config.service.js';
import type { PrismaService } from '../config/prisma/prisma.service.js';

interface AuthDependencies {
  prisma: PrismaService;
  config: AppConfigService;
}

export function createAuth({ prisma, config }: AuthDependencies) {
  return betterAuth({
    appName: 'HelpDesk',
    baseURL: config.betterAuthUrl,
    basePath: `/${config.globalPrefix}/auth`,
    secret: config.betterAuthSecret,
    trustedOrigins: [config.frontendUrl],
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    advanced: {
      cookiePrefix: 'helpdesk',

      crossSubDomainCookies: {
        enabled: config.isProduction,
        domain: config.cookieDomain,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      deferSessionRefresh: true,
    },

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignInAfterSignUp: true,
      requireEmailVerification: false,
      revokeSessionsOnPasswordReset: true,
    },

    emailVerification: {
      sendOnSignUp: false,
      sendOnSignIn: false,
    },

    plugins: [admin({ defaultRole: 'user', adminRoles: ['admin'] }), openAPI()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
