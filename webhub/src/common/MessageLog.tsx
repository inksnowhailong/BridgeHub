import React, { useEffect, useRef } from 'react';
import { Card, List, Typography } from 'antd';
import { MessageType } from '../types/message';

interface MessageLogProps {
  messages: Array<{
    type: string;
    data: any;
    timestamp: number;
  }>;
}

export const MessageLog: React.FC<MessageLogProps> = ({ messages }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card title="实时消息日志" style={{ height: '100%' }}>
      <div ref={listRef} style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item>
              <Typography.Text type="secondary">
                {new Date(message.timestamp).toLocaleString()}
              </Typography.Text>
              <Typography.Text>
                {MessageType[message.type as keyof typeof MessageType] || message.type}
              </Typography.Text>
              <Typography.Text type="secondary">
                {JSON.stringify(message.data)}
              </Typography.Text>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};
