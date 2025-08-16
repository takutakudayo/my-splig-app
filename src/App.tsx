import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Table,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useEffect, useState } from "react";

// 型定義
interface Participant {
  name: string;
  percentage: number;
}

interface Result {
  name: string;
  date: string;
  amount: string;
}

const App = () => {
  const defaultParticipants: Participant[] = [
    { name: "", percentage: 0 },
    { name: "", percentage: 0 },
  ];

  const [form] = Form.useForm();
  const [participants, setParticipants] =
    useState<Participant[]>(defaultParticipants);
  const [date, setDate] = useState<any>(null); // DatePickerの型をanyで暫定
  const [amount, setAmount] = useState<number>(0);
  const [isPercentageValid, setIsPercentageValid] = useState<boolean>(true);
  const [isParticipantsValid, setIsParticipantsValid] = useState<boolean>(true);
  const [result, setResult] = useState<Result[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // 参加者の名前変更
  const handleNameChange = (index: number, value: string): void => {
    const newList = [...participants];
    newList[index].name = value;
    setParticipants(newList);
    validateParticipants(newList);
  };

  // 割合変更
  const handlePercentageChange = (index: number, value: number): void => {
    const newList = [...participants];
    newList[index].percentage = value;
    setParticipants(newList);
    validatePercentage(newList);
  };

  // 計算処理
  const handleCalculate = (): void => {
    if (!date || !amount) return;
    const calc: Result[] = participants.map((p) => ({
      name: p.name,
      date: date.format("YYYY-MM-DD"),
      amount: ((p.percentage / 100) * amount).toFixed(2),
    }));
    setResult(calc);
  };

  // 参加者の名前と割合の行を追加
  const plusOutlined = (): void => {
    setParticipants([...participants, { name: "", percentage: 0 }]);
  };

  // 参加者の名前と割合の行を削除
  const minusOutlined = (index: number): void => {
    const newList = participants.filter((_, i) => i !== index);
    setParticipants(newList);
  };

  // 参加者の名前が空でないか確認
  const validateParticipants = (newList: Participant[]): void => {
    const invalidParticipants = newList.some((p) => p.name === "");
    setIsParticipantsValid(!invalidParticipants);
  };

  // 割合の合計が100であるか確認
  const validatePercentage = (newList: Participant[]): void => {
    const totalPercentage = newList.reduce((sum, p) => sum + p.percentage, 0);
    setIsPercentageValid(totalPercentage === 100);
  };

  // フォームの有効性チェック
  useEffect(() => {
    const allNamesFilled = participants.every((p) => p.name.trim() !== "");
    const totalPercentage = participants.reduce(
      (sum, p) => sum + p.percentage,
      0
    );
    setIsFormValid(
      allNamesFilled && totalPercentage === 100 && date && amount > 0
    );
  }, [participants, date, amount]);

  const columns = [
    { title: "名前", dataIndex: "name", key: "name" },
    { title: "日付", dataIndex: "date", key: "date" },
    { title: "金額 (円)", dataIndex: "amount", key: "amount" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100%" }}>
      <Header style={{ color: "#fff", fontSize: 20 }}>立替生産アプリ</Header>
      <Content>
        <Card title="支払情報を入力">
          <Form layout="vertical" form={form}>
            <Form.Item
              name="date"
              label="日付"
              rules={[{ required: true, message: "日付を入力してください" }]}
            >
              <DatePicker
                style={{ width: "80%" }}
                onChange={setDate}
                placeholder="2025-01-01"
              />
            </Form.Item>

            <Form.Item
              name="amount"
              label="支払総額 (円)"
              rules={[{ required: true, message: "金額を入力してください" }]}
            >
              <InputNumber
                min={0}
                placeholder="10000"
                style={{ width: "80%" }}
                onChange={setAmount}
              />
            </Form.Item>

            <Title level={5}>割り勘相手と割合</Title>

            {participants.map((participant, index) => (
              <Row gutter={8} style={{ marginBottom: 8 }} key={index}>
                <Col span={12}>
                  <Input
                    placeholder="相手の名前"
                    value={participant.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    style={{
                      borderColor: isParticipantsValid ? undefined : "red",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    value={participant.percentage}
                    min={0}
                    max={100}
                    style={{
                      width: "100%",
                      borderColor: isPercentageValid ? undefined : "red",
                    }}
                    placeholder="割合 (%)"
                    onChange={(value) => handlePercentageChange(index, value)}
                  />
                </Col>
              </Row>
            ))}

            {!isParticipantsValid && (
              <Row>
                <Text style={{ color: "red" }}>
                  参加者の名前を入力してください
                </Text>
              </Row>
            )}

            {!isPercentageValid && (
              <Row>
                <Text style={{ color: "red" }}>
                  合計割合を100％にしてください
                </Text>
              </Row>
            )}

            <Row>
              <Col>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                  onClick={plusOutlined}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<MinusOutlined />}
                  style={{ marginBottom: 16, marginLeft: 8 }}
                  onClick={() => minusOutlined(participants.length - 1)}
                />
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                onClick={handleCalculate}
                disabled={!isFormValid}
              >
                計算する
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {result.length > 0 && (
          <Card title="清算結果" style={{ marginTop: 24 }}>
            <Table columns={columns} dataSource={result} pagination={false} />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default App;
