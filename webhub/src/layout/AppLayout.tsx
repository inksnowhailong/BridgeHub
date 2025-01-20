import React from 'react';
import { LaptopOutlined ,HomeOutlined ,FileSyncOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
const { Header, Content, Sider } = Layout;

const navs: MenuProps['items'] = [
  {
    key: `/`,
    icon: React.createElement(HomeOutlined),
    label: `首页`,
  },
  {
    key: `/publisher`,
    icon: React.createElement(LaptopOutlined),
    label: `发布者`,
  },
  {
    key: `/Subscribers`,
    icon: React.createElement(FileSyncOutlined),
    label: `订阅者`,
  },
]

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  return (
    <Layout className='h-full'>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />

      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/']}
            style={{ height: '100%', borderRight: 0 }}
            items={navs}
            onClick={({ key }) => {
              navigate(`${key}`);
            }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
