import React, { useEffect, useRef, useState } from 'react';
import { Card, Timeline, Typography, Button, Modal, Space } from 'antd';
import { MessageType } from '../types/message';
import { ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface MessageLogProps {
  messages: Array<{
    type: string;
    data: any;
    timestamp: number;
    publisherId?: string;
  }>;
}

export const MessageLog: React.FC<MessageLogProps> = ({ messages }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const showMessageDetail = (message: any) => {
    setSelectedMessage(message);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMessage(null);
  };

  const timelineItems = messages.map((message, index) => ({
    key: index,
    dot: <ClockCircleOutlined className="text-base text-blue-400" />,
    children: (
      <div className="bg-gray-50 rounded shadow-sm p-3 mt-2">
        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-1">
          <span>{new Date(message.timestamp).toLocaleString()}</span>
          {message.publisherId && (
            <span className="ml-4">发布者ID: {message.publisherId}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-base">{MessageType[message.type as keyof typeof MessageType] || message.type}</span>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => showMessageDetail(message)}
            className="px-1"
          >
            查看详情
          </Button>
        </div>
      </div>
    )
  }));

  return (
    <Card
      title="实时消息日志"
      className="h-full flex flex-col"
      styles={{
        body: {
          flex: 1,
          padding: '12px'
        }
      }}
    >
      <div
        ref={listRef}
        className="h-full overflow-auto px-3"
      >
        <Timeline items={timelineItems} />
      </div>

      <Modal
        title="消息详情"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedMessage && (
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Typography.Text strong>时间：</Typography.Text>
              <Typography.Text>{new Date(selectedMessage.timestamp).toLocaleString()}</Typography.Text>
            </div>
            {selectedMessage.publisherId && (
              <div>
                <Typography.Text strong>发布者ID：</Typography.Text>
                <Typography.Text>{selectedMessage.publisherId}</Typography.Text>
              </div>
            )}
            <div>
              <Typography.Text strong>消息类型：</Typography.Text>
              <Typography.Text>
                {MessageType[selectedMessage.type as keyof typeof MessageType] || selectedMessage.type}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text strong>消息内容：</Typography.Text>
              <pre className="bg-gray-100 p-2.5 rounded mt-2 max-h-75 overflow-auto">
                {JSON.stringify(selectedMessage.data, null, 2)}
              </pre>
            </div>
          </Space>
        )}
      </Modal>
    </Card>
  );
};
