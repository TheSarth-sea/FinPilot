import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidationTarget = "body" | "params" | "query";

/**
 * Generic Zod validation middleware factory.
 * Returns middleware that validates req[target] against the given schema.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);
      // Replace with parsed (coerced/transformed) values
      (req as any)[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: {
            message: "Validation failed",
            statusCode: 400,
            details: formattedErrors,
          },
        });
        return;
      }
      next(error);
    }
  };
}
