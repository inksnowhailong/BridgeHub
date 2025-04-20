/**
 * @description: 发布的数据类型
 * @return {*}
 */
export const enum PublishDataType {
  /**swagger2版本的文档json数据 */
  SWAGGER2DOCS = 'swagger2_docs'
}

/**
 * @description: 发布者的状态
 * @return {*}
 */
export enum PublisherStatus {
  /**正常 */
  ACTIVE = 'active',
  /**禁用 */
  DISABLE = 'disable',
  /**关闭 */
  CLOSE = 'close',
  /**运行中 */
  RUNNING = 'running',
  /**停止 */
  STOPPED = 'stopped',
  /**错误 */
  ERROR = 'error'
}
