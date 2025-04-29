import React, { useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerViewerProps {
  swaggerDoc: any;
  publisherId: string;
}

export const SwaggerViewer: React.FC<SwaggerViewerProps> = ({ swaggerDoc, publisherId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(swaggerDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swagger-${publisherId}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title="API 文档"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            下载文档
          </Button>
          <Button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '收起' : '展开'}
          </Button>
        </Space>
      }
    >
      <div style={{ height: isExpanded ? 'calc(100vh - 200px)' : '400px', overflow: 'auto' }}>
        {swaggerDoc ? (
          <SwaggerUI spec={swaggerDoc} />
        ) : (
          <Typography.Text type="secondary">暂无 API 文档</Typography.Text>
        )}
      </div>
    </Card>
  );
};
