import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card, Col, Row, Select, Table, Skeleton } from "antd";

const { Title } = Typography;

export const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/v1/blogs");
        setBlogs(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (view === "list") {
      setColumns([
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "Content",
          dataIndex: "content",
          key: "content",
          responsive: ["md"],
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
                  color: status === "public" ? "green" : "red",
                }}
              >
                {status === "public" ? "Published" : "Draft"}
              </span>
            </>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: () => (
            <Select
              defaultValue="Actions"
              style={{ width: "90px" }}
              options={[
                { value: "edit", label: "Edit" },
                { value: "delete", label: "Delete" },
              ]}
            />
          ),
        },
      ]);

      setDataSource(
        blogs.map((blog) => ({
          key: blog._id,
          title: blog.title,
          content: blog.excerpt,
          createdAt: blog.createdAt,
          status: blog.status,
        }))
      );
    }
  }, [view, blogs]);

  return (
    <div>
      <Title>My Blogs</Title>
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
            {blogs.map((blog) => (
              <Col span={8} key={blog._id}>
                <Card title={blog.title}>
                  <p>{blog.excerpt}</p>
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
