import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException
      ? (exception.getResponse() as any).message || exception.message
      : 'Internal server error';

    logger.log('error', 'request_error', {
      path: request.originalUrl,
      method: request.method,
      statusCode: status,
      error: exception instanceof Error ? exception.message : String(exception),
    });

    response.status(status).json({
      success: false,
      message,
      statusCode: status,
    });
  }
}
