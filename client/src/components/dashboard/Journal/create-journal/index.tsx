import { Button, Col, Form, Input, Select, Row, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { TextEditor } from "../../../../utils/TextEditor/editor";

const { Title } = Typography;
const { Item } = Form;

export const CreateJournal: FC = () => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState<any>();

  useEffect(() => {
    form.setFieldsValue({
      title: "Test",
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
      <Title level={2}>Add Journal Entry</Title>
      <Row>
        <Col span={24}>
          <Item
            name="title"
            rules={[{ required: true, message: "Please input journal title!" }]}
          >
            <Input placeholder="Title" name="title" />
          </Item>
          <Item name="createdAt">
            <Input placeholder="createdAt" name="createdAt" />
          </Item>
          <Item
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
          </Item>
          <Item
            name="content"
            rules={[{ required: false, message: "Please input Blog Content!" }]}
          >
            <TextEditor
              name="content"
              eContent={editorContent}
              eData={editorsData}
            />
          </Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
