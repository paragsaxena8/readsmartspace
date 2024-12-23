import { FC, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  FormProps,
  Input,
  Row,
  Spin,
  message,
} from "antd";
import { useAuth } from "../../../utils/context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type LoginType = {
  username?: string;
  password?: string;
  remember?: string;
};

type RegisterType = {
  email?: string;
  name?: string;
  username?: string;
  password?: string;
  passwordConfirm?: string;
};
export const Auth: FC = () => {
  const [loading, setLoading] = useState(false);
  const [registrationForm] = Form.useForm<RegisterType>();
  const [loginForm] = Form.useForm<LoginType>();
  const [messageApi, contextHolder] = message.useMessage();

  const [authType, setAuthType] = useState("login");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const onFinishLogin: FormProps<LoginType>["onFinish"] = (values) => {
    setLoading(true);
    console.log("Success:", values);
    axios
      .post("/api/v1/auth/login", values)
      .then((res) => {
        setLoading(false);
        setUser((prev: any) => {
          return {
            ...prev,
            isAuthenticated: true,
            user: res.data.user,
            token: res.data.token,
          };
        });

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        // Redirect to dashboard
        navigate("/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        messageApi.error(err.response.data.message);
      });
  };

  const onFinishRegister: FormProps<RegisterType>["onFinish"] = (values) => {
    console.log("Success:", values);
    setLoading(true);
    axios
      .post("/api/v1/auth/register", values)
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        messageApi.success(res.data.message);
        registrationForm.resetFields();
        setAuthType("login");
      })
      .catch((err) => {
        setLoading(false);
        messageApi.error(err.response.data.message);
        console.log(err);
      });
  };

  const onFinishFailed: FormProps<
    LoginType | RegisterType
  >["onFinishFailed"] = (errorInfo) => {
    setLoading(false);
    console.log("Failed:", errorInfo);
  };

  return (
    <Row
      style={{
        height: "100vh",
        backgroundImage: "url('./src/assets/img/bg.jpg')",
        backgroundSize: "cover",
      }}
    >
      {contextHolder}
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Card title={authType.toUpperCase()} style={{ width: "auto" }}>
          {authType === "login" ? (
            <Form
              name="login"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinishLogin}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={loginForm}
            >
              <Form.Item<LoginType>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<LoginType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item<LoginType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Flex>
                  <Spin spinning={loading}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Spin>
                  {/* Register if don't have account */}
                  <Button
                    type="link"
                    onClick={() => {
                      setAuthType("register");
                    }}
                  >
                    Register
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          ) : (
            <Form
              name="register"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinishRegister}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={registrationForm}
            >
              <Form.Item<RegisterType>
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<RegisterType>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<RegisterType>
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input type="email" />
              </Form.Item>

              <Form.Item<RegisterType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be minimum 6 characters",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item<RegisterType>
                label="Password Conf"
                name="passwordConfirm"
                rules={[
                  {
                    required: true,
                    message: "Please input your password confirmation!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Flex>
                  <Spin spinning={loading}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Spin>
                  {/* Login if already have account */}
                  <Button
                    type="link"
                    onClick={() => {
                      setAuthType("login");
                    }}
                  >
                    Login
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
};
