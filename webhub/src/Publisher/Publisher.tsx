import { useState, useEffect } from "react";
import { PublisherApi } from "./api";
import request from "@/utils/request";
import { Space, Switch, Table, TableProps, Tag } from "antd";
import { PublisherEntity, PublisherStatus } from "./entities";
import { PaginationParams } from "@/common/abstract/Pagination.dto";

export default function Publisher() {
  const Api = new PublisherApi(request);

  const [data, setData] = useState<PublisherEntity[]>([]);
  const [loading, setLoading] = useState<string[]>([]);
  const [pageParams, setPageParams] = useState<PaginationParams>({
    pageSize: 10,
    currentPage: 1,
  });
  const [total, setTotal] = useState(0);

  const columns: TableProps<PublisherEntity>["columns"] = [
    {
      title: "服务的名字",
      dataIndex: "serverName",
    },
    {
      title: "服务的git",
      dataIndex: "gitUrl",
      render: (text) => (
        <a target="_blank" href={text}>
          {text}
        </a>
      ),
    },
    {
      title: "服务创建时间",
      dataIndex: "createdAt",
      render: (text) => new Date(Number(text)).toLocaleString(),
    },
    {
      title: "上一次启动时间",
      dataIndex: "lastStartedAt",
      render: (text) => new Date(Number(text)).toLocaleString(),
    },
    {
      title: "服务的状态",
      dataIndex: "status",
      render: (_, { id, status }) => (
        <Space>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={status !== PublisherStatus.DISABLE}
            onChange={() => updatePublisherStatus(id, status)}
            loading={loading.includes(id)}
          />
          <Tag
            color={
              {
                active: "green",
                disable: "red",
                close: "blue",
              }[status] || "blue"
            }
          >
            {
              {
                active: "启用",
                disable: "禁用",
                close: "关闭",
              }[status]
            }
          </Tag>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <Space size="middle"></Space>,
    },
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
    console.log("res :>> ", res);
    setData(res.data.data);
    setTotal(res.data.Pagination.totalCount);
  };
  const updatePublisherStatus = async (id: string, status: PublisherStatus) => {
    setLoading((loading) => [...loading, id]);
    const res = await Api.updatePublisherStatus({
      id,
      status:
        status === PublisherStatus.DISABLE
          ? PublisherStatus.CLOSE
          : PublisherStatus.DISABLE,
    });
    setLoading((loading) => loading.filter((item) => item !== id));
    getPublisherList();
  };
  useEffect(() => {
    getPublisherList();
  }, [pageParams]);
  return (
    <>
      <button onClick={createPublisher}>createPublisher</button>
      <Table<PublisherEntity>
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        pagination={{
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          current: pageParams.currentPage,
          pageSize: pageParams.pageSize,
          onChange: (currentPage, pageSize) => {
            setPageParams({
              currentPage,
              pageSize,
            });
          },
        }}
      ></Table>
    </>
  );
}
