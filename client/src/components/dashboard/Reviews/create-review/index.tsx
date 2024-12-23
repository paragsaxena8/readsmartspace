import { Button, Col, Form, Input, Radio, Rate, Row, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { TextEditor } from "../../../../utils/TextEditor/editor";
import { CustomSearch } from "../../../common/custom-search";
import { ThreeDBook } from "../../../common/ThreeDBook";

const { Title } = Typography;
const { Item } = Form;
const { Group } = Radio;

export const CreateReview: FC = () => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState<any>();
  const [bookId, setBookId] = useState<string>("");
  const [bookName, setBookName] = useState<string>("");

  useEffect(() => {
    form.setFieldsValue({
      bookId: bookId,
      title: "Test",
      reviewText: editorContent,
      rating: 0,
      recommended: false,
    });
  }, [form, bookId]);
  const editorsData = (data: any) => {
    // console.log("🚀 ~ editorsData ~ data:", data);
    setEditorContent(data.content);
  };

  useEffect(() => {}, []);

  const onFinish = (values: any) => {
    console.log("🚀 ~ values:", values);
  };

  const searchOutput = (val: string | undefined) => {
    // console.log("🚀 ~ searchOutput ~ value:", val);
    const { value, label } = JSON.parse(val || "{}");
    setBookName(label);
    form.setFieldsValue({ bookId: value });
    setBookId(value);
  };

  return (
    <>
      <Title level={2}>Add Review</Title>
      <Form onFinish={onFinish} form={form}>
        <Row>
          <Col span={12}>
            <Item
              name="bookId"
              label="Book Name"
              rules={[{ required: true, message: "Please select Book" }]}
            >
              <CustomSearch
                placeholder="Search Book"
                url="/api/v1/books"
                style={{ width: 200 }}
                onOutput={searchOutput}
              />
            </Item>
          </Col>
        </Row>
        {bookName && bookName.length > 0 ? (
          <Row>
            <Col span={18}>
              <Item
                name="title"
                label="Review Title"
                rules={[
                  { required: true, message: "Please input Review Title!" },
                ]}
              >
                <Input placeholder="Title" name="title" />
              </Item>
              <Item
                name="content"
                rules={[
                  { required: false, message: "Please input Blog Content!" },
                ]}
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
            <Col
              span={6}
              style={{
                display: "flex",
                gap: "3rem",
                alignItems: "center",
                flexDirection: "column",
              }}
              hidden={!bookName}
            >
              <>
                <ThreeDBook bookName={bookName} featureImage={""} />
                <Item
                  name="rating"
                  rules={[{ required: true, message: "Input Rating" }]}
                >
                  <Rate
                    onChange={(v) =>
                      form.setFieldsValue({
                        rating: v,
                      })
                    }
                  />
                </Item>
                <Item
                  name="recommended"
                  rules={[
                    { required: false, message: "Add your recommendation" },
                  ]}
                >
                  <Group buttonStyle="solid">
                    <Radio.Button value={true}>Recommended</Radio.Button>
                    <Radio.Button value={false}>
                      Nahh! Not Recommended
                    </Radio.Button>
                  </Group>
                </Item>
              </>
            </Col>
          </Row>
        ) : null}
      </Form>
    </>
  );
};
