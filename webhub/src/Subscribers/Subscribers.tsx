import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SubscriberApi } from './api';
import { SubscriberEntity, SubscriberCreateParamsDTO } from './entities';
import { SubscriberStatus } from '../types/subscriber';
import request from '@/utils/request';
import { PaginationParams } from '@/common/abstract/Pagination.dto';

const Subscribers: React.FC = () => {
  const Api = new SubscriberApi(request);
  const [subscribers, setSubscribers] = useState<SubscriberEntity[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<SubscriberEntity | null>(null);
  const [form] = Form.useForm();
  const [pageParams, setPageParams] = useState<PaginationParams>({
    pageSize: 10,
    currentPage: 1,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getSubscriberList = async () => {
    try {
      setLoading(true);
      const res = await Api.getSubscriberList(pageParams);
      console.log(res);

      if (res.code === 200 && res.data?.data?.data) {
        setSubscribers(res.data.data.data);
        setTotal(res.data.data.pagination?.totalCount || 0);
      } else {
        setSubscribers([]);
        setTotal(0);
      }
    } catch (error) {
      message.error('获取订阅者列表失败');
      setSubscribers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriberList();
  }, [pageParams]);

  const handleCreate = () => {
    setEditingSubscriber(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: SubscriberEntity) => {
    setEditingSubscriber(record);
    form.setFieldsValue({
      ...record,
      publisherIds: record.publisherIds ? record.publisherIds.split(',') : []
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await Api.deleteSubscriber(id);
      message.success('删除成功');
      getSubscriberList();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data: SubscriberCreateParamsDTO = {
        ...values,
        publisherIds: values.publisherIds || [],
        customData: JSON.stringify({})
      };

      if (editingSubscriber) {
        await Api.updateSubscriber({ ...data, id: editingSubscriber.id });
        message.success('更新成功');
      } else {
        await Api.createSubscriber(data);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      getSubscriberList();
    } catch (error) {
      message.error(editingSubscriber ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'serverName',
      key: 'serverName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: SubscriberStatus) => {
        const statusMap = {
          [SubscriberStatus.OPEN]: '已连接',
          [SubscriberStatus.CLOSE]: '未连接',
          [SubscriberStatus.DISABLE]: '已禁用'
        };
        return statusMap[status] || status;
      }
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
    },
    {
      title: '订阅的发布者',
      dataIndex: 'publisherIds',
      key: 'publisherIds',
      render: (publisherIds: string) => {
        if (!publisherIds) return '-';
        const ids = publisherIds.split(',');
        return ids.map(id => {
          const publisher = publishers.find(p => p.id === id);
          return publisher ? publisher.serverName : id;
        }).join(', ');
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SubscriberEntity) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="订阅者管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          创建订阅者
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={subscribers}
        rowKey="id"
        loading={loading}
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
      />

      <Modal
        title={editingSubscriber ? '编辑订阅者' : '创建订阅者'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="serverName"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="deviceId"
            label="设备ID"
            rules={[{ required: true, message: '请输入设备ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="authData"
            label="认证信息"
            rules={[{ required: true, message: '请输入认证信息' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="publisherIds"
            label="订阅的发布者"
          >
            <Select mode="multiple">
              {publishers.map(publisher => (
                <Select.Option key={publisher.id} value={publisher.id}>
                  {publisher.serverName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Subscribers;
