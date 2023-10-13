import { z } from 'zod';

const envVarsSchema = z.object({
  // NODE_ENV: z.enum(['development', 'production', 'test', 'provision']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  // FRONT_BASE_URL: z.string(),
});

type EnvVars = z.infer<typeof envVarsSchema>;

class ConfigService {
  private readonly envConfig: EnvVars;

  constructor(config: unknown) {
    this.envConfig = this.validateInput(config);
  }

  private validateInput(config: unknown) {
    const result = envVarsSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Config validation error: ${result.error}`);
    }
    return result.data;
  }

  // get isDev() {
  //   return this.envConfig.NODE_ENV === 'development';
  // }

  // get isProd() {
  //   return this.envConfig.NODE_ENV === 'production';
  // }

  // get isTest() {
  //   return this.envConfig.NODE_ENV === 'test';
  // }

  get host() {
    return this.envConfig.HOST;
  }

  get port() {
    const processPort = Number(process.env.PORT);
    return Number.isInteger(processPort) ? processPort : this.envConfig.PORT;
  }

  get databaseUrl() {
    return this.envConfig.DATABASE_URL;
  }

  get jwtSecret() {
    return this.envConfig.JWT_SECRET;
  }

  // get frontBaseUrl() {
  //   return this.envConfig.FRONT_BASE_URL;
  // }
}

export const configService = new ConfigService(process.env);
