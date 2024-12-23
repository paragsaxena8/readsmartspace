import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  Col,
  Row,
  Select,
  Skeleton,
  Divider,
  Avatar,
  Button,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Meta } = Card;

export const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const navigate = useNavigate();
  const convertDate = (date:Date) => {
    return new Date(date).toLocaleString();
  };
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

  return (
    <div>
      <Title>My Blogs</Title>
      <Row >
        <Col span={2} style={{ marginLeft: "auto", marginRight: '1.5rem'  }}>
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
        <Col span={2}>
          <Button type="primary" onClick={() => navigate("/create-blog")}>Create Blog</Button>
        </Col>
      </Row>
      <Divider />
      <Skeleton loading={loading} />
      <Row
        style={{
          marginTop: "20px",
        }}
      >
        <div
          className="blogs"
          style={
            view === "grid"
              ? {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                }
              : {}
          }
        >
          {blogs.map((blog) => {
            // Add the following code snippet
            if (view === "grid") {
              return (
                <Card
                  key={blog._id}
                  hoverable
                  style={{ width: "auto" }}
                  cover={
                    <img alt="example" src="https://via.placeholder.com/30" />
                  }
                >
                  <div
                    style={{
                      minHeight: "4.5rem",
                    }}
                  >
                    <Meta title={blog.title} description={blog.excerpt} />
                  </div>
                  <Divider />
                  <Meta
                    avatar={<Avatar src="https://via.placeholder.com/30" />}
                    title={blog.author ? blog.author.name : ""}
                    description="Published on Sept 02, 2024"
                  />
                </Card>
              );
            } else {
              return (
                <div className="blog" key={blog._id}>
                  <div className="blog-header">
                    <span>
                      {blog.author
                        ? blog.author.name
                          ? blog.author.name
                          : blog.author
                        : ""}
                    </span>
                  </div>
                  <div className="blog-body">
                    <div className="blog-content">
                      <h2>{blog.title}</h2>
                      <p>{blog.excerpt}</p>
                    </div>
                    <div className="blog-image">
                      <img src="https://via.placeholder.com/30x30" alt="blog" />
                    </div>
                  </div>
                  <div className="blog-footer">
                    <span>
                      <button type="button" onClick={() => navigate(`/edit-blog/${blog._id}`)}>Edit</button>
                      <button>Delete</button>
                    </span>
                    <span>{convertDate(blog.updatedAt)}</span>
                    <span>{blog.status === 'public' ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </Row>
    </div>
  );
};
