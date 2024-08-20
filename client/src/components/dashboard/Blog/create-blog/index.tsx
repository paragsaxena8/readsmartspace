import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import { TextEditor } from "../../../../utils/TextEditor/editor";
import { FC, useEffect, useState } from "react";

const { Title } = Typography;

export const CreateBlog: FC = () => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState<any>();

  useEffect(() => {
    form.setFieldsValue({
      title: "Test",
      categories: "category1",
      tags: ["tag1", "tag2"],
      content: editorContent,
    });
  }, [form, editorContent]);
  const editorsData = (data: any) => {
    console.log("🚀 ~ editorsData ~ data:", data);
    setEditorContent(data.content);
  };

  const onFinish = (values: any) => {
    console.log("🚀 ~ values:", values);
  };

  return (
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
              style={{ width: '100%' }}
              options={[
                { value: "", label: "Select", disabled: true },
                { value: "category1", label: "Category1" },
                { value: "category2", label: "Category2" },
                { value: "category3", label: "Category3" },
                { value: "category4", label: "Category4" },
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
              options={[
                { value: "tag1", label: "Tag1" },
                { value: "tag2", label: "Tag2" },
                { value: "tag3", label: "Tag3" },
                { value: "tag4", label: "Tag4" },
              ]}
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
  );
};
