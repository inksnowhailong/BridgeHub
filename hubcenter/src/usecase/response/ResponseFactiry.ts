import { ResponseDTO } from 'src/domain/dto/response.dto';
import { ResponseCode } from 'src/domain/enum/reponse.enum';

/**响应携带内容 */
export class PayloadType {
  code?: number;
  data: any;
  customMessage?: string;
  constructor(code: number, data: any, customMessage?: string) {
    this.code = code;
    this.data = data;
    this.customMessage = customMessage;
  }
}

abstract class ResponseProduct {
  abstract responseData: ResponseDTO;
  abstract formatResponse(): ResponseDTO;
}

/**
 * @description:2xx 请求成功
 * @return {*}
 */
class successResponse extends ResponseProduct {
  responseData: ResponseDTO;
  constructor(
    private code: number,
    private payload: PayloadType
  ) {
    super();
    this.responseData = this.formatResponse();
    if (payload.customMessage) {
      this.responseData.message = payload.customMessage;
    }
  }
  formatResponse(): ResponseDTO {
    return new ResponseDTO(this.code, '请求成功', this.payload.data);
  }
}
/**
 * @description: 3xx 请求重定向
 * @return {*}
 */
class redirectResponse extends ResponseProduct {
  responseData: ResponseDTO;
  constructor(
    private code: number,
    private payload: PayloadType
  ) {
    super();
    this.responseData = this.formatResponse();
  }
  formatResponse(): ResponseDTO {
    return new ResponseDTO(
      this.code,
      this.messageBaseOnCode(this.code),
      this.payload.data
    );
  }
  messageBaseOnCode(code: number): string {
    return ResponseCode[code] || '重定向';
  }
}

/**
 * @description: 4xx 客户端错误
 * @return {*}
 */
class clientErrorResponse extends ResponseProduct {
  responseData: ResponseDTO;
  constructor(
    private code: number,
    private payload: PayloadType
  ) {
    super();
    this.responseData = this.formatResponse();
  }
  formatResponse(): ResponseDTO {
    return new ResponseDTO(
      this.code,
      this.messageBaseOnCode(this.code),
      this.payload.data
    );
  }
  messageBaseOnCode(code: number): string {
    return ResponseCode[code] || '客户端错误';
  }
}

/**
 * @description: 5xx 服务器错误
 * @return {*}
 */
class serverErrorResponse extends ResponseProduct {
  responseData: ResponseDTO;
  constructor(
    private code: number,
    private payload: PayloadType
  ) {
    super();
    this.responseData = this.formatResponse();
  }
  formatResponse(): ResponseDTO {
    return new ResponseDTO(
      this.code,
      this.messageBaseOnCode(this.code),
      this.payload.data
    );
  }
  messageBaseOnCode(code: number): string {
    return ResponseCode[code] || '服务器错误';
  }
}

/**
 * @description: 响应数据工厂
 * @return {*}
 */
export class ResponseFactiry {
  public createResponse(payload: PayloadType | ResponseDTO): ResponseDTO {
    if (payload instanceof ResponseDTO) {
      return payload;
    }
    const code = payload.code || 500;
    const startCode = code.toString().charAt(0);
    switch (startCode) {
      case '2':
        return new successResponse(code, payload).responseData;
      case '3':
        return new redirectResponse(code, payload).responseData;
      case '4':
        return new clientErrorResponse(code, payload).responseData;
      case '5':
        return new serverErrorResponse(code, payload).responseData;
      default:
        break;
    }
  }
}
