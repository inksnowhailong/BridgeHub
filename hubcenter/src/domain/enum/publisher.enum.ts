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
export const enum PublisherStatus {
  /**正常 */
  ACTIVE = 'normal',
  /**禁用 */
  DISABLE = 'disable',
  /**关闭 */
  CLOSE = 'close'
}
