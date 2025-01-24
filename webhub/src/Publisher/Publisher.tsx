import React from 'react'
import { PublisherApi } from './api'
import request from '@/utils/request'
export default function Publisher() {
    const Api = new PublisherApi(request)
    const createPublisher = async () => {
        const res = await Api.createPublisher({
          serverName: '测试发布者',
          gitUrl: 'https://github.com/inksnowhailong/BridgeHub.git',
          authData: 'no',
          deviceId: 'iid',
          serverType: 'node',
          customData: '{}'
        })
        console.log(res)
    }
  return (
    <>
      <button onClick={createPublisher}>createPublisher</button>
    </>

  )
}
