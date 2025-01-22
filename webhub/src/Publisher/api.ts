import { AsyncBase } from "../common/abstract/AsyncBase";

export class PublisherApi extends AsyncBase {
  private BASE_URL = "/publisher";

  testHello() {
    return this.request({
      url: this.BASE_URL + "/list",
      method: "GET",
    });
  }
}
