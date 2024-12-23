import { Button, Col, Form, Input, message, Result, Row, Select, Typography } from "antd";
import { TextEditor } from "../../../../utils/TextEditor/editor";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export const CreateBlog: FC = () => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState<any>();
  const [categories, setCategories] = useState<any>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await axios
        .get("/api/v1/blog-categories")
        .then((res) => {
          res.data.data.map((category: any) => {
            setCategories((prev: any) => {
              return [...prev, { value: category._id, label: category.name }];
            });
          });
        })
        .catch((err) => {
          console.log("🚀 ~ file: index.tsx ~ line 31 ~ err", err);
        });

      await axios
        .get("/api/v1/blog-tags")
        .then((res) => {
          res.data.data.map((tag: any) => {
            setTags((prev: any) => {
              return [...prev, { value: tag._id, label: tag.name }];
            });
          });
        })
        .catch((err) => {
          console.log("🚀 ~ file: index.tsx ~ line 31 ~ err", err);
        });
    })();

  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      categories: "",
      tags: [],
      content: editorContent,
    });
  }, [form]);

  useEffect(() => {
    form.setFieldsValue({
      content: editorContent,
    });
  }, [editorContent]);

  const editorsData = (data: any) => {
    setEditorContent(data.content);
  };

  const onFinish = (values: any) => {
    console.log("🚀 ~ values:", values);
    const data = {...values, author: localStorage.getItem("userId") ?? ""};
    console.log("🚀 ~ onFinish ~ data:", data)
    axios.post("/api/v1/blogs", data).then((res) => {
      messageApi.open({
        type: 'success',
        content: 'Blog Created Successfully',
      })
      form.resetFields();
      navigate("/blogs");
    });

  };

  return (
    <>
     {contextHolder}
    <Form onFinish={onFinish} form={form}>
      <Title level={2}>Create Blog</Title>
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
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
    </>
  );
};
