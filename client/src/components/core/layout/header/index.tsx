import { useContext } from "react";
import { Layout, Dropdown, Button, Space, Switch, MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { ThemeContext } from "../../../../utils/context/ThemeContext";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export const Topbar = () => {
  const { mode, toggleMode } = useContext(ThemeContext);
  const { getItem } = useLocalStorage();
  const navigate = useNavigate();

  const user = JSON.parse(getItem("user") || "{}");

  const logout = () => {
    if (user) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <strong
          style={{
            textAlign: "center",
          }}
        >
          {user?.name}
        </strong>
      ),
      key: "name",
    },
    {
      label: "Account Settings",
      key: "account",
      icon: <SettingOutlined />,
      onClick: () => {
        navigate("/account");
      }
    },
    {
      type: "divider",
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      <div style={{ float: "right" }}>
        <Space>
          <Switch checked={mode === "dark"} onChange={toggleMode} />
          {mode === "dark" ? <BulbFilled /> : <BulbOutlined />}
        </Space>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Space>
            <Button type="link" icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};
