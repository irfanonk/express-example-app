import * as dotenv from "dotenv";
import { ZodError, z } from "zod";

const environmentSchema = z.object(
  {
    NODE_ENV: z.enum(["development", "production"], {
      required_error: "NODE_ENV is required",
      invalid_type_error:
        "NODE_ENV must be either 'development' or 'production'",
    }),
    PORT: z.string({
      required_error: "PORT is required",
      invalid_type_error: "PORT must be a string",
    }),
    DATABASE_URL: z.string({
      required_error: "DATABASE_URL is required",
      invalid_type_error: "DATABASE_URL must be a string",
    }),
    JWT_SECRET: z.string({
      required_error: "DATABASE_URL is required",
      invalid_type_error: "DATABASE_URL must be a string",
    }),
  },
  {
    required_error: "Environment was not found",
  }
);

export const loadEnvIntoProcess = () => {
  try {
    // if available, load .env file into process.env
    dotenv.config();

    // make sure process.env contains all required variables
    environmentSchema.parse(process.env);
  } catch (error) {
    console.error("Something went wrong while parsing environment");

    if (error instanceof ZodError) {
      console.error(error.format());
      // format zod error to show which env variables are missing then print it to console (including name of the missing env variable)
      process.exit(1);
    }

    throw error;
  }
};
