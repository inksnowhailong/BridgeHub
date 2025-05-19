import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { MessageLog } from '../common/MessageLog';
import { Websocket } from '../utils/websocket';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<Array<{
    type: string;
    data: any;
    timestamp: number;
    publisherId?: string;
  }>>([ ]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 初始化 WebSocket 连接
  React.useEffect(() => {
    const wsServer = 'http://localhost:3080/web'; // 从配置中获取
    const ws = new Websocket(wsServer);

   // 使用封装好的方法
  ws.onMessage((message: any) => {
    console.log(message);

    setMessages(prev => [...prev, {
      type: message.messageType,
      data: message.data,
      timestamp: Date.now()
    }]);
  });

    return () => {
      ws.disconnect();
    };
  }, []);

  const menuItems = [
    {
      key: '/',
      label: '首页',
      onClick: () => navigate('/'),
    },
    {
      key: '/publishers',
      label: '发布者管理',
      onClick: () => navigate('/publishers'),
    },
    {
      key: '/subscribers',
      label: '订阅者管理',
      onClick: () => navigate('/subscribers'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <h1 style={{ color: 'white', margin: 0 }}>BridgeHub 管理平台</h1>
      </Header>
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ background: colorBgContainer }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
          <Sider
            width={400}
            className="bg-white"
            style={{
              padding: '12px',
              height: 'calc(100vh - 64px)',
              overflow: 'hidden'
            }}
          >
            <MessageLog messages={messages} />
          </Sider>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
