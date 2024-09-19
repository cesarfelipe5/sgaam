import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";

const MainPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAluno, setLoadingAluno] = useState(false);
  const [form] = Form.useForm();
  const [sortKey, setSortKey] = useState("name");

  const getData = async () => {
    setLoading(true);

    const { data } = await AlunosService.getData();

    setDataSource(data);

    setLoading(false);
  };

  const getAlunoById = async ({ id }) => {
    setLoadingAluno(true);

    const { data } = await AlunosService.getById({ id });

    setLoadingAluno(false);

    return data;
  };

  const handleAdd = () => {
    setEditingRecord(null);

    form.resetFields();

    setModalVisible(true);
  };

  const handleEdit = async (id) => {
    const data = await getAlunoById({ id });

    setEditingRecord(data);

    form.setFieldsValue(data);

    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    AlunosService.removeById({ id });

    await getData();
  };

  const handleViewDetails = async (id) => {
    const data = await getAlunoById({ id });

    setEditingRecord(data);

    setViewDetailsVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingRecord) {
          setDataSource(
            dataSource.map((item) =>
              item.key === editingRecord.key
                ? { ...values, key: editingRecord.key }
                : item
            )
          );
        } else {
          setDataSource([
            ...dataSource,
            { ...values, key: Date.now().toString() },
          ]);
        }
        setModalVisible(false);

        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
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
      if (value === "status") {
        const statusOrder = { Ativo: 1, Inativo: 2 };
        return (
          statusOrder[a.status] - statusOrder[b.status] ||
          a.name.localeCompare(b.name)
        );
      }
      return a[value].localeCompare(b[value]);
    });
    setDataSource(sortedData);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
    const filteredData = dataSource.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );
    setDataSource(filteredData);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "RG",
      dataIndex: "rg",
      key: "rg",
    },
    {
      title: "cpf",
      dataIndex: "cpf",
      key: "cpf",
    },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <>
    //       {status === "Ativo" ? (
    //         <span>
    //           <span style={{ color: "green", marginRight: "5px" }}>●</span>{" "}
    //           Ativo
    //         </span>
    //       ) : (
    //         <span>
    //           <span style={{ color: "red", marginRight: "5px" }}>●</span>{" "}
    //           Inativo
    //         </span>
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   title: "Modalidades",
    //   dataIndex: "modalities",
    //   key: "modalities",
    //   render: (modalities) => (
    //     <>
    //       {modalities.map((modality, index) => (
    //         <Tag key={index}>{modality}</Tag>
    //       ))}
    //     </>
    //   ),
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handleViewDetails(record.id)}
            style={{ borderColor: "green", color: "green" }}
          >
            Ver Detalhes
          </Button>

          <Button onClick={() => handleEdit(record.id)} loading={loadingAluno}>
            Editar
          </Button>

          <Button danger onClick={() => handleDelete(record.id)}>
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <DrawerMenu />

      <Spin spinning={loading}>
        <div style={{ padding: "16px" }}>
          <Space style={{ marginBottom: "16px" }}>
            <Button
              style={{ background: "black" }}
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

          <Table columns={columns} dataSource={dataSource} pagination={false} />

          <Modal
            title={editingRecord ? "Editar Aluno" : "Adicionar Aluno"}
            open={modalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Salvar"
            cancelText="Cancelar"
          >
            <Form form={form} layout="vertical" name="studentForm">
              <Form.Item
                name="nome"
                label="Nome"
                rules={[{ required: true, message: "Nome é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              {/* <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Email é obrigatório" }]}
              >
                <Input />
              </Form.Item>
 */}
              {/* <Form.Item name="dob" label="Data de Nascimento">
                <Input type="date" />
              </Form.Item> */}

              {/* <Form.Item
                name="contact1"
                label="Contato 1"
                rules={[
                  { required: true, message: "Contato 1 é obrigatório" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "O contato deve conter apenas números",
                  },
                ]}
              >
                <Input />
              </Form.Item> */}

              {/* <Form.Item
                name="contact2"
                label="Contato 2 (opcional)"
                rules={[
                  {
                    pattern: /^[0-9]*$/,
                    message: "O contato deve conter apenas números",
                  },
                ]}
              >
                <Input />
              </Form.Item> */}

              <Form.Item
                name="cpf"
                label="CPF"
                rules={[
                  { required: true, message: "CPF é obrigatório" },
                  {
                    pattern: /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/,
                    message:
                      "CPF deve ser válido, no formato 123.456.789-00 ou apenas números",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="rg"
                label="RG"
                rules={[
                  { required: true, message: "RG é obrigatório" },
                  {
                    pattern: /^[0-9]{7,11}$/,
                    message: "RG deve conter entre 7 a 11 números",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cep"
                label="Cep"
                rules={[{ required: true, message: "CEP é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="logradouro"
                label="Logradouro"
                rules={[
                  { required: true, message: "Logradouro é obrigatório" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="numero"
                label="Númeor"
                rules={[{ required: true, message: "Número é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="bairro"
                label="Bairro"
                rules={[{ required: true, message: "Bairro é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cidade"
                label="Cidade"
                rules={[{ required: true, message: "Cidade é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="uf"
                label="UF"
                rules={[{ required: true, message: "UF é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              {/* <Form.Item
                name="plan"
                label="Plano de Pagamento"
                rules={[
                  {
                    required: true,
                    message: "Plano de pagamento é obrigatório",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="mensal">Mensal</Select.Option>
                  <Select.Option value="semestral">Semestral</Select.Option>
                  <Select.Option value="anual">Anual</Select.Option>
                </Select>
              </Form.Item> */}

              {/* <Form.Item name="modalities" label="Modalidades">
                <Checkbox.Group>
                  <Checkbox value="kung fu">Kung Fu</Checkbox>
                  <Checkbox value="xadrez">Xadrez</Checkbox>
                  <Checkbox value="hapkido">Hapkido</Checkbox>
                </Checkbox.Group>
              </Form.Item> */}

              {/* Add fields for Total Value and Start Date */}

              {/* <Form.Item
                name="totalValue"
                label="Valor total para o período"
                rules={[
                  { required: true, message: "Valor total é obrigatório" },
                ]}
              >
                <Input placeholder="R$ 0,00" />
              </Form.Item> */}

              {/* <Form.Item
                name="startDate"
                label="Data de início"
                rules={[
                  { required: true, message: "Data de início é obrigatória" },
                ]}
              >
                <Input type="date" />
              </Form.Item> */}

              {/* <Form.Item name="observation" label="Observação">
                <Input.TextArea rows={4} />
              </Form.Item> */}
            </Form>
          </Modal>

          <Modal
            title="Detalhes do Aluno"
            open={viewDetailsVisible}
            onCancel={handleCancel}
            footer={null}
          >
            {editingRecord && (
              <div>
                <p>
                  <strong>Nome:</strong> {editingRecord.nome}
                </p>

                <p>
                  <strong>CPF:</strong> {editingRecord.cpf}
                </p>

                <p>
                  <strong>RG:</strong> {editingRecord.rg}
                </p>

                <p>
                  <strong>CEP:</strong> {editingRecord.cep}
                </p>

                <p>
                  <strong>Logradouro:</strong> {editingRecord.logradouro}
                </p>

                <p>
                  <strong>Número: </strong> {editingRecord.numero}
                </p>

                <p>
                  <strong>Bairro:</strong> {editingRecord.bairro}
                </p>

                <p>
                  <strong>Cidade:</strong> {editingRecord.cidade}
                </p>

                <p>
                  <strong>Estado:</strong> {editingRecord.uf}
                </p>

                {/*

                <p>
                  <strong>CPF:</strong> {editingRecord.cpf}
                </p>

                <p>
                  <strong>RG:</strong> {editingRecord.rg}
                </p>

                <p>
                  <strong>Status:</strong> {editingRecord.status}
                </p>

                <p>
                  <strong>Endereço:</strong> {editingRecord.address}
                </p>

                <p>
                  <strong>Modalidades:</strong>{" "}
                  {editingRecord.modalities.join(", ")}
                </p>

                <p>
                  <strong>Plano de Pagamento:</strong> {editingRecord?.plan}
                </p>

                <p>
                  <strong>Valor total para o período:</strong>{" "}
                  {editingRecord.totalValue}
                </p>

                <p>
                  <strong>Data de início:</strong> {editingRecord.startDate}
                </p>

                <p>
                  <strong>Observação:</strong>{" "}
                  {editingRecord.observation || "N/A"}
                </p> */}
              </div>
            )}
          </Modal>
        </div>
      </Spin>
    </div>
  );
};

export default MainPage;
