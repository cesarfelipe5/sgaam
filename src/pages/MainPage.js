import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, Checkbox, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DrawerMenu from '../components/DrawerMenu';

// Mock Data
const initialData = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    dob: '2000-01-01',
    contact1: '123456789',
    contact2: '987654321',
    plan: 'mensal',
    cpf: '12345678900',
    rg: '123456789',
    status: 'Ativo',
    address: '123 Street, City',
    modalities: ['kung fu', 'xadrez'],
    observation: 'No observations',
    totalValue: 'R$ 120,00',
    startDate: '2023-01-01'
  },
  {
    key: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    dob: '1995-05-15',
    contact1: '555555555',
    contact2: '',
    plan: 'anual',
    cpf: '98765432100',
    rg: '987654321',
    status: 'Inativo',
    address: '456 Avenue, City',
    modalities: ['hapkido'],
    observation: '',
    totalValue: 'R$ 1.200,00',
    startDate: '2023-06-01'
  }
];

const MainPage = () => {
  const [dataSource, setDataSource] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [sortKey, setSortKey] = useState('name');

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleViewDetails = (record) => {
    setEditingRecord(record);
    setViewDetailsVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (editingRecord) {
          setDataSource(dataSource.map(item => (item.key === editingRecord.key ? { ...values, key: editingRecord.key } : item)));
        } else {
          setDataSource([...dataSource, { ...values, key: Date.now().toString() }]);
        }
        setModalVisible(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
    setViewDetailsVisible(false);
    form.resetFields();
  };

  const handleSort = (value) => {
    setSortKey(value);
    const sortedData = [...dataSource].sort((a, b) => {
      if (value === 'status') {
        const statusOrder = { 'Ativo': 1, 'Inativo': 2 };
        return statusOrder[a.status] - statusOrder[b.status] || a.name.localeCompare(b.name);
      }
      return a[value].localeCompare(b[value]);
    });
    setDataSource(sortedData);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
    const filteredData = initialData.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );
    setDataSource(filteredData);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <>
          {status === 'Ativo' ? (
            <span><span style={{ color: 'green', marginRight: '5px' }}>●</span> Ativo</span>
          ) : (
            <span><span style={{ color: 'red', marginRight: '5px' }}>●</span> Inativo</span>
          )}
        </>
      ),
    },
    {
      title: 'Modalidades',
      dataIndex: 'modalities',
      key: 'modalities',
      render: (modalities) => (
        <>
          {modalities.map((modality, index) => (
            <Tag key={index}>{modality}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleViewDetails(record)} style={{ borderColor: 'green', color: 'green' }}>
            Ver Detalhes
          </Button>
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Button danger onClick={() => handleDelete(record.key)}>Excluir</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <DrawerMenu />
      <div style={{ padding: '16px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Button
            style={{ background: 'black' }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Adicionar Aluno
          </Button>
          <Input
            placeholder="Buscar por nome"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 200 }}
          />
          <Select
            defaultValue="Ordenar por Nome"
            onChange={handleSort}
            style={{ width: 200 }}
          >
            <Select.Option value="name">Ordenar por Nome</Select.Option>
            <Select.Option value="status">Ordenar por Status</Select.Option>
          </Select>
        </Space>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <Modal
          title={editingRecord ? "Editar Aluno" : "Adicionar Aluno"}
          visible={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form
            form={form}
            layout="vertical"
            name="studentForm"
          >
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: 'Nome é obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Email é obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dob"
              label="Data de Nascimento"
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="contact1"
              label="Contato 1"
              rules={[
                { required: true, message: 'Contato 1 é obrigatório' },
                { pattern: /^[0-9]+$/, message: 'O contato deve conter apenas números' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contact2"
              label="Contato 2 (opcional)"
              rules={[
                { pattern: /^[0-9]*$/, message: 'O contato deve conter apenas números' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[
                { required: true, message: 'CPF é obrigatório' },
                {
                  pattern: /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/,
                  message: 'CPF deve ser válido, no formato 123.456.789-00 ou apenas números'
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="rg"
              label="RG"
              rules={[
                { required: true, message: 'RG é obrigatório' },
                { pattern: /^[0-9]{7,11}$/, message: 'RG deve conter entre 7 a 11 números' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Status é obrigatório' }]}
            >
              <Select>
                <Select.Option value="Ativo">Ativo</Select.Option>
                <Select.Option value="Inativo">Inativo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="address"
              label="Endereço"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="plan"
              label="Plano de Pagamento"
              rules={[{ required: true, message: 'Plano de pagamento é obrigatório' }]}
            >
              <Select>
                <Select.Option value="mensal">Mensal</Select.Option>
                <Select.Option value="semestral">Semestral</Select.Option>
                <Select.Option value="anual">Anual</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="modalities"
              label="Modalidades"
            >
              <Checkbox.Group>
                <Checkbox value="kung fu">Kung Fu</Checkbox>
                <Checkbox value="xadrez">Xadrez</Checkbox>
                <Checkbox value="hapkido">Hapkido</Checkbox>
              </Checkbox.Group>
            </Form.Item>

            {/* Add fields for Total Value and Start Date */}
            <Form.Item
              name="totalValue"
              label="Valor total para o período"
              rules={[{ required: true, message: 'Valor total é obrigatório' }]}
            >
              <Input placeholder="R$ 0,00" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Data de início"
              rules={[{ required: true, message: 'Data de início é obrigatória' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="observation"
              label="Observação"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Detalhes do Aluno"
          visible={viewDetailsVisible}
          onCancel={handleCancel}
          footer={null}
        >
          {editingRecord && (
            <div>
              <p><strong>Nome:</strong> {editingRecord.name}</p>
              <p><strong>Email:</strong> {editingRecord.email}</p>
              <p><strong>Data de Nascimento:</strong> {editingRecord.dob}</p>
              <p><strong>Contato 1:</strong> {editingRecord.contact1}</p>
              <p><strong>Contato 2:</strong> {editingRecord.contact2 || 'N/A'}</p>
              <p><strong>CPF:</strong> {editingRecord.cpf}</p>
              <p><strong>RG:</strong> {editingRecord.rg}</p>
              <p><strong>Status:</strong> {editingRecord.status}</p>
              <p><strong>Endereço:</strong> {editingRecord.address}</p>
              <p><strong>Modalidades:</strong> {editingRecord.modalities.join(', ')}</p>
              <p><strong>Plano de Pagamento:</strong> {editingRecord?.plan}</p>
              <p><strong>Valor total para o período:</strong> {editingRecord.totalValue}</p>
              <p><strong>Data de início:</strong> {editingRecord.startDate}</p>
              <p><strong>Observação:</strong> {editingRecord.observation || 'N/A'}</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MainPage;
