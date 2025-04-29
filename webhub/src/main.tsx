import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from './layout/MainLayout';
import Publisher from './Publisher/Publisher';
import Subscribers from './Subscribers/Subscribers';
import Home from './Home';
import './index.less';
import "virtual:uno.css";
import { ConfigProvider, ConfigProviderProps } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

type Locale = ConfigProviderProps["locale"];
dayjs.locale("zh-cn");

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "publishers",
        element: <Publisher />,
      },
      {
        path: "subscribers",
        element: <Subscribers />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN as Locale}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);
