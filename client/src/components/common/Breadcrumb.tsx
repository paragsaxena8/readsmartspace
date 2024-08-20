import { Breadcrumb } from "antd";

export const TitleBar = ({ title }: { title: string }) => {
  return <Breadcrumb items={[{ title }]} />;
};
