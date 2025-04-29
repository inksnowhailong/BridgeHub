import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MessageType } from '../types/message';
import { Websocket } from '../utils/websocket';

interface Subscriber {
  id: string;
  serverName: string;
  status: string;
  deviceId: string;
  serverType: string;
  subscribedPublishers: string[];
}

const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [publishers, setPublishers] = useState<Array<{ id: string; serverName: string }>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [form] = Form.useForm();
  const [socket, setSocket] = useState<Websocket | null>(null);

  useEffect(() => {
    const wsServer = 'ws://localhost:3000'; // 从配置中获取
    const ws = new Websocket(wsServer);
    setSocket(ws);

    // 获取订阅者列表
    ws.emit('message', {
      type: MessageType.SUBSCRIBER_LIST,
      data: {},
    }, (res: any) => {
      if (res.data) {
        setSubscribers(res.data);
      }
    });

    // 获取发布者列表
    ws.emit('message', {
      type: MessageType.PUBLISHER_LIST,
      data: {},
    }, (res: any) => {
      if (res.data) {
        setPublishers(res.data);
      }
    });

    return () => {
      ws.socket.disconnect();
    };
  }, []);

  const handleCreate = () => {
    setEditingSubscriber(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Subscriber) => {
    setEditingSubscriber(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个订阅者吗？',
      onOk: () => {
        socket?.emit('message', {
          type: MessageType.SUBSCRIBER_DELETE,
          data: { id },
        }, (res: any) => {
          if (res.success) {
            message.success('删除成功');
            setSubscribers(subscribers.filter(s => s.id !== id));
          } else {
            message.error(res.message);
          }
        });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const messageType = editingSubscriber
        ? MessageType.SUBSCRIBER_UPDATE
        : MessageType.SUBSCRIBER_CREATE;

      socket?.emit('message', {
        type: messageType,
        data: editingSubscriber ? { ...values, id: editingSubscriber.id } : values,
      }, (res: any) => {
        if (res.success) {
          message.success(editingSubscriber ? '更新成功' : '创建成功');
          setIsModalVisible(false);
          // 刷新列表
          socket?.emit('message', {
            type: MessageType.SUBSCRIBER_LIST,
            data: {},
          }, (res: any) => {
            if (res.data) {
              setSubscribers(res.data);
            }
          });
        } else {
          message.error(res.message);
        }
      });
    });
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
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
    },
    {
      title: '服务类型',
      dataIndex: 'serverType',
      key: 'serverType',
    },
    {
      title: '订阅的发布者',
      dataIndex: 'subscribedPublishers',
      key: 'subscribedPublishers',
      render: (publishers: string[]) => publishers.join(', '),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Subscriber) => (
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
            name="serverType"
            label="服务类型"
            rules={[{ required: true, message: '请选择服务类型' }]}
          >
            <Select>
              <Select.Option value="node">Node.js</Select.Option>
              <Select.Option value="java">Java</Select.Option>
              <Select.Option value="python">Python</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subscribedPublishers"
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
