/**
 * @description: 分页信息
 * @return {*}
 */
/**
 * @description: 分页信息类，封装分页逻辑
 */

import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class Pagination {
  /**总数据量 */
  totalCount: number;
  /**每页数据量 */
  pageSize: number;
  /**当前页码 */
  currentPage: number;
  /**总页数 */
  totalPages: number;
  /**是否有下一页 */
  hasNextPage: boolean;
  /**是否有上一页 */
  hasPreviousPage: boolean;

  constructor(totalCount: number, pageSize: number, currentPage: number) {
    this.totalCount = totalCount;
    this.pageSize = pageSize;
    this.currentPage = currentPage;

    // 计算分页逻辑
    this.totalPages = Math.ceil(totalCount / pageSize);
    this.hasNextPage = currentPage < this.totalPages;
    this.hasPreviousPage = currentPage > 1;
  }

  /**
   * @description: 构建一个包含分页信息的数据
   * @param {T} data
   * @return {*}
   */
  createPaginationResult<T>(data: T): PaginationResult<T> {
    return new PaginationResult(data, this.totalCount, {
      currentPage: this.currentPage,
      pageSize: this.pageSize
    });
  }

  // 可以增加一些辅助方法
  getOffset(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  // 检查是否是最后一页
  isLastPage(): boolean {
    return !this.hasNextPage;
  }
}

/**
 * @description: 分页查询数据的参数
 * @return {*}
 */

export class PaginationParams {
  /**每页数据量 */
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number(value ?? 10))
  pageSize: number = 10;

  /**当前页码 */
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number(value ?? 1))
  currentPage: number = 1;
}

/**
 * @description:数据转为包含分页数据的工具类型
 * @return {*}
 */

export class PaginationResult<T> {
  data: T;
  pagination: Pagination;

  constructor(data: T, total: number, params: PaginationParams) {
    this.data = data;
    this.pagination = new Pagination(
      total,
      params.pageSize,
      params.currentPage
    );
  }
}
