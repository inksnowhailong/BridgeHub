import {
  PublisherCreateParamsDTO,
  PublisherUpdateParamsDTO
} from '../dto/publisher.dto';
import { PublisherEntity } from '../entities/publisher.entity';
import { PaginationParams, PaginationResult } from '../dto/Pagination.dto';

export abstract class PublisherRepository {
  /**
   * @description: 创建发布者
   * @param {PublisherEntity} params
   * @return {*}
   */
  abstract createPublisher(params: PublisherEntity): Promise<PublisherEntity>;

  /**
   * @description: 更新发布者
   * @param {string} id
   * @param {PublisherEntity} params
   * @return {*}
   */
  abstract updatePublisher(params: PublisherEntity): Promise<PublisherEntity>;
  /**
   * @description: 根据id获取发布者
   * @param {string} id
   * @return {*}
   */
  abstract getPublisherById(id: string): Promise<PublisherEntity>;

  /**
   * @description: 根据服务名模糊查询发布者
   * @return {*}
   */
  abstract getPublisherByServerName(
    serverName: string,
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>>;

  /**
   * @description: 获取所有发布者
   * @return {*}
   */
  abstract getAllPublisher(): Promise<PublisherEntity[]>;

  abstract getListByPage(
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>>;
}
