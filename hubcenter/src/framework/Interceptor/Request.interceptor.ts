import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ResponseDTO } from 'src/domain/dto/response.dto';
import { ResponseFactiry } from 'src/usecase/response/ResponseFactiry';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseDTO> {
    const reponse = new ResponseFactiry();
    return next.handle().pipe(
      map((data) => {
        // 只处理成功的响应
        console.log('Successful response:', data);
        return reponse.createResponse(data);
      }),
      catchError((error) => {
        // 错误处理逻辑
        console.log(error);

        // 使用 ResponseFactory 来创建错误响应
        return throwError(() => reponse.createResponse(error));
      })
    );
  }
}
