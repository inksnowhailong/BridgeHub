import { useState, useEffect } from "react";
import { PublisherApi } from "./api";
import request from "@/utils/request";
import { Button, Space, Switch, Table, TableProps, Tag, Form, Modal, Input, Select, Popconfirm, message } from "antd";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

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
            unCheckedChildren="禁用"
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
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个发布者吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const res = await Api.createPublisher(values);
      closeModal();
      getPublisherList();
    } catch (e) {
      // 校验失败
    }
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

  const handleDelete = async (id: string) => {
    try {
      await Api.deletePublisher(id);
      message.success('删除成功');
      getPublisherList();
    } catch (error) {
      message.error('删除失败');
    }
  };

  useEffect(() => {
    getPublisherList();
  }, [pageParams]);

  return (
    <>
      {/* <Button onClick={openModal}>创建发布者</Button> */}
      <Modal
        title="创建发布者"
        open={modalVisible}
        onOk={handleCreate}
        onCancel={closeModal}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            serverType: "node",
            customData: "{}",
          }}
        >
          <Form.Item
            label="服务名称"
            name="serverName"
            rules={[{ required: true, message: "请输入服务名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Git 地址"
            name="gitUrl"
            rules={[{ required: true, message: "请输入Git地址" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="认证信息"
            name="authData"
            rules={[{ required: true, message: "请输入认证信息" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="设备ID"
            name="deviceId"
            rules={[{ required: true, message: "请输入设备ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="服务类型"
            name="serverType"
            rules={[{ required: true, message: "请选择服务类型" }]}
          >
            <Select>
              <Select.Option value="node">Node</Select.Option>
              <Select.Option value="python">Python</Select.Option>
              {/* 其他类型可自行添加 */}
            </Select>
          </Form.Item>
          <Form.Item
            label="自定义数据"
            name="customData"
            rules={[{ required: true, message: "请输入自定义数据" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
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
