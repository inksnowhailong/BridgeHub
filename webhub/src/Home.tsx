import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="p-6">
      <Typography>
        <Title level={2}>欢迎使用 BridgeHub 管理平台</Title>
        <Paragraph>
          BridgeHub 是一个强大的消息桥接平台，帮助您轻松管理和监控发布者与订阅者之间的通信。
        </Paragraph>
      </Typography>

      <Card title="平台特点" className="mt-6">
        <ul className="list-disc pl-6">
          <li>实时消息监控和日志记录</li>
          <li>灵活的发布者-订阅者管理</li>
          <li>强大的消息过滤和路由功能</li>
          <li>直观的 Web 管理界面</li>
          <li>支持多种消息协议和格式</li>
        </ul>
      </Card>
    </div>
  );
}
