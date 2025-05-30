import {
  PaginationParams,
  PaginationResult,
} from "@/common/abstract/Pagination.dto";
import { AsyncBase } from "../common/abstract/AsyncBase";
import { PublisherCreateParamsDTO, PublisherEntity } from "./entities";

export class PublisherApi extends AsyncBase {
  private BASE_URL = "/publisher";

  createPublisher = async (data: PublisherCreateParamsDTO) => {
    return await this.request({
      url: `${this.BASE_URL}/create`,
      method: "POST",
      data,
    });
  };
  getPublisherList = async <
    T extends PaginationParams,
    R extends PaginationResult<PublisherEntity[]>
  >(
    params: T
  ) => {
    return await this.request<T, R>({
      url: `${this.BASE_URL}/list`,
      method: "GET",
      params,
    });
  };
  updatePublisherStatus = async <
    T extends {
      id: string;
      status: string;
    },
    R extends PublisherEntity
  >(
    data: T
  ) => {
    return await this.request<T, R>({
      url: `${this.BASE_URL}/updateStatus`,
      method: "POST",
      data,
    });
  };

  deletePublisher = async (id: string) => {
    return await this.request({
      url: `${this.BASE_URL}/delete`,
      method: "POST",
      data: { id },
    });
  };
}
