import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../env.validation.js';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  // Server Configuration
  get port(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  get domain(): string {
    return this.configService.getOrThrow<string>('DOMAIN');
  }

  get globalPrefix(): string {
    return this.configService.getOrThrow<string>('GLOBAL_PREFIX');
  }

  get isProduction(): boolean {
    return (
      this.configService.get<string>('NODE_ENV') === Environment.Production
    );
  }

  get cookieDomain(): string | undefined {
    return this.isProduction ? this.domain : undefined;
  }

  // Database Configuration
  get databaseUrl(): string {
    return this.configService.getOrThrow<string>('DATABASE_URL');
  }

  // Auth Configuration
  get betterAuthSecret(): string {
    return this.configService.getOrThrow<string>('BETTER_AUTH_SECRET');
  }

  get betterAuthUrl(): string {
    return this.configService.getOrThrow<string>('BETTER_AUTH_URL');
  }

  // Frontend Configuration
  get frontendUrl(): string {
    return this.configService.getOrThrow<string>('FRONTEND_URL');
  }
}
