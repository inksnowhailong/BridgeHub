/**
 * @description: 请求的参数数据
 * @return {*}
 */
export interface Parameter {
  name: string;
  in: string;
  description?: string;
  required: boolean;
  type: string;
  schema?: any;
}

/**
 * @description: 请求的响应数据
 * @return {*}
 */
export interface Response {
  description: string;
  schema?: any;
}

/**
 * @description: 请求相关的信息
 * @return {*}
 */
export interface Method {
  tags: string[];
  summary: string;
  operationId: string;
  consumes?: string[];
  produces?: string[];
  parameters?: Parameter[];
  responses: { [statusCode: string]: Response };
}

/**
 * @description: 所有接口 key为请求的路径
 * @return {*}
 */
export interface Path {
  [method: string]: Method;
}

/**
 * @description: swagger文档数据
 * @return {*}
 */
export interface ApiJsonDTO {
  paths: { [path: string]: Path };
  basePath: string;
}
