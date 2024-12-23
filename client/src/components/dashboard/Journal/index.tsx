import { Row, Col, Select, Card, Table, Skeleton } from "antd";
import { Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

import { useEffect, useState } from "react";

export const Journal = () => {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/v1/journals");
        setJournals(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setColumns([
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_: any, { createdAt }: { createdAt: string }) => (
          <p>{new Date(createdAt).toDateString()}</p>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (_: any, { status }: { status: string }) => (
          <>
            <span
              style={{
                color: status === "published" ? "green" : "red",
              }}
            >
              {status}
            </span>
          </>
        ),
      },
    ]);

    setDataSource(
      journals.map((journal) => ({
        key: journal._id,
        ...journal,
      })),
    );
  }, [journals]);

  return (
    <div>
      <Title>My Journal</Title>
      <Row>
        <Col span={4} style={{ marginLeft: "auto" }}>
          <Select
            defaultValue="list"
            style={{ width: 120 }}
            onChange={(value) => setView(value)}
            options={[
              { value: "grid", label: "Grid" },
              { value: "list", label: "List" },
            ]}
          />
        </Col>
      </Row>
      <Skeleton loading={loading} />
      <Row
        style={{
          marginTop: "20px",
        }}
      >
        {view === "grid" ? (
          <>
            {journals.map((journal) => (
              <Col span={8} key={journal._id}>
                <Card title={journal.title}>
                  <p>{new Date(journal.createdAt).toDateString()}</p>
                </Card>
              </Col>
            ))}
          </>
        ) : (
          <Table dataSource={dataSource} columns={columns} bordered />
        )}
      </Row>
    </div>
  );
};
