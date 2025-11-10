import { Prisma } from "@prisma/client";

export class DatabaseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new DatabaseError(400, `Database request error: ${error.code}`);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError(400, "Invalid query or data validation failed.");
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new DatabaseError(500, "Database initialization failed.");
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new DatabaseError(500, "Unknown database error occurred.");
  }

  throw new DatabaseError(500, "Internal database error.");
}
