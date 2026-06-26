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
  switch (error.code) {
    case "P2025":
      // Before: "The requested record or relation could not be found."
      throw new DatabaseError(404, "The property or image you are trying to update does not exist.");
      
    case "P2002":
      // Before: "A record with this unique value already exists."
      throw new DatabaseError(409, "This item already exists in the system (duplicate entry).");
      
    case "P2003":
      // Before: "Foreign key constraint failed. A related record is missing."
      throw new DatabaseError(400, "This action cannot be completed because a linked asset is missing.");
      
    default:
      throw new DatabaseError(400, "A database error occurred while processing your request.");
  }
}

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError(400, "Data validation failed. Please check your field formats.");
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new DatabaseError(500, "Database connection is down.");
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new DatabaseError(500, "An unknown database system failure occurred.");
  }

  // If it's already an AppError or DatabaseError, just let it pass through
  if (error instanceof Error && 'statusCode' in error) {
    throw error;
  }

  throw new DatabaseError(500, "Internal server database error.");
}