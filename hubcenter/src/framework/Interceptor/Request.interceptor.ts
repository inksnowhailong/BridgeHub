import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseDTO } from 'src/domain/dto/response.dto';
import { Response } from 'express'; // 确保导入的是 Express 的 Response 类型

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseDTO> {
    const httpctx = context.switchToHttp();
    const res = httpctx.getResponse<Response>();
    const status = res.statusCode;
    return next.handle().pipe(
      map((data) => {
        // 只处理成功的响应

        return new ResponseDTO(status, '请求成功', data);
      }),
      catchError((error) => {
        // 错误处理逻辑
        // 使用 ResponseFactory 来创建错误响应
        return throwError(() => error);
      })
    );
  }
}
