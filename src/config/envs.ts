import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  USERS_MICROSERVICE_HOST: string;
  USERS_MICROSERVICE_PORT: number;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  USERS_MICROSERVICE_HOST: Joi.string().required(),
  USERS_MICROSERVICE_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  usersMicroserviceHost: envVars.USERS_MICROSERVICE_HOST,
  usersMicroservicePort: envVars.USERS_MICROSERVICE_PORT,
};
