import React, { useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";

const { Header, Content } = Layout;
const { Title } = Typography;

const defaultParticipants = [
  { name: "", percentage: 0 },
  { name: "", percentage: 0 },
  { name: "", percentage: 0 },
];

const SampleApp = () => {
  const [form] = Form.useForm();
  const [participants, setParticipants] = useState(defaultParticipants);
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState([]);

  const handleNameChange = (index, value) => {
    const newList = [...participants];
    newList[index].name = value;
    setParticipants(newList);
  };

  const handlePercentageChange = (index, value) => {
    const newList = [...participants];
    newList[index].percentage = value;
    setParticipants(newList);
  };

  const handleCalculate = () => {
    if (!date || !amount) return;
    const calc = participants.map((p) => ({
      name: p.name,
      date: date.format("YYYY-MM-DD"),
      amount: ((p.percentage / 100) * amount).toFixed(2),
    }));
    setResult(calc);
  };

  const columns = [
    { title: "名前", dataIndex: "name", key: "name" },
    { title: "日付", dataIndex: "date", key: "date" },
    { title: "金額 (円)", dataIndex: "amount", key: "amount" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100%" }}>
      <Header style={{ color: "#fff", fontSize: 20 }}>立替精算アプリ</Header>
      <Content style={{ padding: "24px", maxWidth: "100%", width: "100%" }}>
        <Card title="支払い情報入力">
          <Form layout="vertical" form={form}>
            <Form.Item label="日付">
              <DatePicker onChange={setDate} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="支払総額 (円)">
              <InputNumber
                min={0}
                value={amount}
                onChange={setAmount}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Title level={5}>割り勘相手と割合</Title>
            {participants.map((p, index) => (
              <Row gutter={8} key={index} style={{ marginBottom: 8 }}>
                <Col span={12}>
                  <Input
                    placeholder="名前"
                    value={p.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    placeholder="%"
                    min={0}
                    max={100}
                    value={p.percentage}
                    onChange={(value) => handlePercentageChange(index, value)}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>
            ))}

            <Form.Item>
              <Button type="primary" onClick={handleCalculate}>
                計算する
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {result.length > 0 && (
          <Card title="精算結果" style={{ marginTop: 24 }}>
            <Table
              columns={columns}
              dataSource={result}
              pagination={false}
              rowKey="name"
            />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default SampleApp;
