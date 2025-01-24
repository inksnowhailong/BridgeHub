import { AsyncBase } from "../common/abstract/AsyncBase";

export class PublisherApi extends AsyncBase {
  private BASE_URL = "/publisher";

 createPublisher = async (params: any) => {
    return await this.request({
      url: `${this.BASE_URL}/create`,
      method: "POST",
      data: params,
    })
  }
}
