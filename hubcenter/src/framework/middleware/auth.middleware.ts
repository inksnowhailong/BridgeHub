import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // // 获取请求头中的认证信息
    // const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //   return res.status(401).json({ message: '未提供认证信息' });
    // }

    // 这里可以添加更复杂的认证逻辑
    // 例如验证 token、检查权限等

    next();
  }
}
