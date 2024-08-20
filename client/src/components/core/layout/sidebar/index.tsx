import { Menu, MenuProps } from "antd";
import { XFilled } from "@ant-design/icons";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import { routesArray } from "../../routes/routes";
import { Link } from "react-router-dom";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];
export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    console.log("i fire once");
    // console.log(props);
    setSidebarItems(prepareMenuItems(routesArray));
    // console.log(sidebarItems);
    // return () => console.log("Cleanup..");
  }, []);

  function getItem(
    label: React.ReactNode,
    key: any,
    children?: MenuItem[],
    icon?: React.ReactNode
  ): MenuItem {
    return {
      key,
      children,
      label,
      icon,
    } as MenuItem;
  }

  function toTitleAndLink({ id, path }: { id: string; path: string }) {
    const label = id.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    if (path) {
      return (
        <Link to={path}>
          <b>{label}</b>
        </Link>
      );
    }
    return <b>{label}</b>;
  }

  const prepareMenuItems = (arr: any[]): MenuItem[] | any => {
    return arr && arr.length > 0
      ? arr.map((r) => {
          return getItem(
            toTitleAndLink(r),
            r.id,
            prepareMenuItems(r.children),
            <XFilled />
          );
        })
      : null;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      style={{ minHeight: "100dvh" }}
      onCollapse={(value) => {
        setCollapsed(value);
      }}
    >
      <img
        src="https://placehold.co/180x40"
        alt="logo"
        style={{
          margin: "0.5rem",
        }}
      />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["Dashboard"]}
        items={sidebarItems}
      />
      {/* {...sidebarItems.map((item: any) => {
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
                <Link to={item.key} />
              </Menu.Item>
            );
          })}
        </Menu> */}
    </Sider>
  );
};
