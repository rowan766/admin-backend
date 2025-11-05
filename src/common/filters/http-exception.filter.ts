import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 获取异常信息
    const exceptionResponse: any = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message || '请求失败';

    // 统一错误响应格式
    response.status(status).json({
      code: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}