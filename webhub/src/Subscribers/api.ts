import {
  PaginationParams,
  PaginationResult,
} from "@/common/abstract/Pagination.dto";
import { AsyncBase } from "../common/abstract/AsyncBase";
import { SubscriberEntity } from "./entities";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

interface SubscriberListResponse {
  code: number;
  message: string;
  data: {
    data: SubscriberEntity[];
    pagination: {
      totalCount: number;
      pageSize: number;
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  timestamp: number;
}

export class SubscriberApi extends AsyncBase {
  private BASE_URL = "/subscriber";

  createSubscriber = async (data: any) => {
    return await this.request({
      url: `${this.BASE_URL}/create`,
      method: "POST",
      data,
    });
  };

  getSubscriberList = async <T extends PaginationParams>(
    params: T
  ): Promise<ApiResponse<SubscriberListResponse>> => {
    return await this.request<T, ApiResponse<SubscriberListResponse>>({
      url: `${this.BASE_URL}/list`,
      method: "GET",
      params,
    });
  };

  updateSubscriber = async (data: any) => {
    return await this.request({
      url: `${this.BASE_URL}/update`,
      method: "POST",
      data,
    });
  };

  deleteSubscriber = async (id: string) => {
    return await this.request({
      url: `${this.BASE_URL}/delete/${id}`,
      method: "POST",
    });
  };
}
