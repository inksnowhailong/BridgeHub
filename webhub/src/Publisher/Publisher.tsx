import { useState } from "react";
import { PublisherApi } from "./api";
import request from "@/utils/request";
import { Table, TableProps, Tag } from "antd";
import { PublisherEntity } from "./entities";
import { PaginationParams } from "@/common/abstract/Pagination.dto";

export default function Publisher() {
  const Api = new PublisherApi(request);

  const [data, setData] = useState<PublisherEntity[]>([]);
  const [pageParams, setPageParams] = useState<PaginationParams>({
    pageSize: 10,
    currentPage: 1,
  });

  const columns: TableProps<PublisherEntity>["columns"] = [
    {
      title: "服务的名字",
      dataIndex: "serverName",
      key: "serverName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "服务的git",
      dataIndex: "gitUrl",
      key: "gitUrl",
    },
    {
      title: "服务创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "上一次启动时间",
      dataIndex: "lastStartedAt",
      key: "lastStartedAt",
    },
    {
      title: "服务的状态",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          <Tag
            color={
              {
                active: "green",
                disable: "red",
                close: "default",
              }[status] || "blue"
            }
          >
            {status}
          </Tag>
        </>
      ),
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];
  const createPublisher = async () => {
    const res = await Api.createPublisher({
      serverName: "测试发布者",
      gitUrl: "https://github.com/inksnowhailong/BridgeHub.git",
      authData: "no",
      deviceId: "iid",
      serverType: "node",
      customData: "{}",
    });
    console.log(res);
  };
  const getPublisherList = async () => {
    const res = await Api.getPublisherList(pageParams);
    console.log('res :>> ', res);
    // setData(res.data.data);
  }
  getPublisherList();
  return (
    <>
      <button onClick={createPublisher}>createPublisher</button>
      <Table<PublisherEntity> columns={columns} dataSource={data}></Table>
    </>
  );
}
