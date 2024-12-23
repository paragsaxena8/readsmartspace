import {
  Button,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Typography,
} from "antd";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { TextEditor } from "../../../utils/TextEditor/editor";

const { Title } = Typography;

export const ViewEditBlog: FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [blogData, setBlogData] = useState<any>();
  const [editorContent, setEditorContent] = useState<any>();
  const [categories, setCategories] = useState<any>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await axios
        .get(`/api/v1/blogs/${id}`)
        .then((res) => {
          const data = res.data.data;
          // console.log("🚀 ~ .then ~ data:", data)
          setBlogData(data);
          form.setFieldsValue({
            title: data.title,
            categories: data.categories.name,
            tags: data.tags.map((tag: any) => tag.name),
          });

          setEditorContent(data.content);
        })
        .catch((err) => {
          console.log("🚀 ~ file: index.tsx ~ line 31 ~ err", err);
        });
    })();
  }, []);

  const editorsData = (data: any) => {
    setEditorContent(data.content);
  };

  const onFinish = (values: any) => {
    console.log("🚀 ~ values:", values);
    const data = { ...values, author: localStorage.getItem("userId") ?? "" };
    console.log("🚀 ~ onFinish ~ data:", data);
    axios.post("/api/v1/blogs", data).then((res) => {
      messageApi.open({
        type: "success",
        content: "Blog Created Successfully",
      });
      form.resetFields();
      navigate("/blogs");
    });
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>Edit Blog</Title>
      <Form form={form}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input Blog Title!" }]}
        >
          <Input placeholder="Title" name="title" />
        </Form.Item>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              name="categories"
              rules={[{ required: true, message: "Please select Category" }]}
            >
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: "", label: "Select", disabled: true },
                  ...categories,
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tags"
              rules={[{ required: true, message: "Please select Tags" }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Tags Mode"
                options={tags}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="content"
          rules={[{ required: false, message: "Please input Blog Content!" }]}
        >
          <TextEditor
            name="content"
            eContent={editorContent}
            eData={editorsData}
          />
        </Form.Item>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={onFinish}
          onCancel={() => console.log("canceled")}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Popconfirm>
      </Form>
    </>
  );
};
