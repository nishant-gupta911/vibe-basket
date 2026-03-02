import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Patterns that indicate a message should be redacted before sending
 * to the client.  Only server-side logs should contain the raw detail.
 */
const SENSITIVE_PATTERNS = [
  /prisma/i,
  /SQLITE|SQLSTATE|constraint|violat/i,
  /relation.*does not exist/i,
  /column.*does not exist/i,
  /unique.*constraint/i,
  /foreign key/i,
  /connect ECONNREFUSED/i,
  /ENOTFOUND|EAI_AGAIN/i,
  /at\s+\S+\s+\(.*:\d+:\d+\)/,       // stack-trace frame
  /DATABASE_URL|REDIS_HOST|JWT_SECRET|API_KEY|RAZORPAY/i,
  /process\.env/i,
];

function isSensitive(text: string): boolean {
  return SENSITIVE_PATTERNS.some((p) => p.test(text));
}

const GENERIC_SERVER_ERROR = 'An unexpected error occurred. Please try again later.';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // ── build a safe client-facing message ──────────────────────────
    let message: string;

    if (exception instanceof HttpException) {
      const raw = exception.getResponse();
      const rawMsg =
        typeof raw === 'string'
          ? raw
          : (raw as any).message ?? exception.message;
      const joined = Array.isArray(rawMsg) ? rawMsg.join(', ') : String(rawMsg);

      // For 4xx, the message is typically intentional (validation, auth).
      // For 5xx, always use a generic message.  Either way, redact
      // anything that looks sensitive.
      message =
        status >= 500 || isSensitive(joined) ? GENERIC_SERVER_ERROR : joined;
    } else {
      message = GENERIC_SERVER_ERROR;
    }

    // ── log the real error server-side (never sent to client) ───────
    logger.log('error', 'request_error', {
      path: request.originalUrl,
      method: request.method,
      statusCode: status,
      error:
        exception instanceof Error ? exception.message : String(exception),
    });

    // ── response: always { success, message, statusCode } ──────────
    response.status(status).json({
      success: false,
      message,
      statusCode: status,
    });
  }
}
