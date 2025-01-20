import React from 'react'
import { PublisherApi } from './api'
import request from '@/utils/request'
export default function Publisher() {
    const Api = new PublisherApi(request)
    Api.testHello().then(res => {
        console.log(res)
    })
  return (
    <div>Publisher</div>
  )
}
