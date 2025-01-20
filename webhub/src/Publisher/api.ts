import { AsyncBase } from "../common/abstract/AsyncBase";

export class PublisherApi extends AsyncBase {

  testHello() {
    return this.request({
        url: '/',
        method: 'GET'
    })
  }
}
