import { FC, useState } from "react";
import { Layout, theme } from "antd";
import { Topbar } from "./header";
import { Sidebar } from "./sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export const MainLayout: FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [hide, setHide] = useState(false);

  const setCollapse = (collapsed: any) => {
    setHide(collapsed);
  };

  return (

    <Layout>
      <Sidebar />
      <Layout>
        <Topbar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
