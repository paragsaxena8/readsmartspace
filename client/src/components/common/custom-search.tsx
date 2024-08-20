import React, { useEffect, useState } from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";
import axios from "axios";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

export const CustomSearch: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
  url: string;
  onOutput: (value: string | undefined) => void;
}> = (props) => {
  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<string>();

  const fetch = (
    value: string,
    callback: (data: { value: string; text: string }[]) => void
  ) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    console.log("🚀 ~ currentValue:", currentValue);

    const API_REQ = () => {
      axios.get(`${props.url}/search?title=${currentValue}`).then((d: any) => {
        if (currentValue === value) {
          const { data } = d.data;
          const result = data.map((item: any) => ({
            value: item._id,
            label: item.title,
          }));
          callback(result);
        }
      });
    };
    if (value) {
      timeout = setTimeout(API_REQ, 700);
    } else {
      callback([]);
    }
  };

  const handleSearch = (newValue: string) => {
    if (newValue.length < 3) return;
    fetch(newValue, setData);
  };

  const handleChange = (newValue: string) => {
    // console.log("🚀 ~ handleChange ~ newValue:", newValue)
    setValue(newValue);
  };

  useEffect(() => {
    props.onOutput(value);
  }, [value]);

  return (
    <Select
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={true}
      onFocus={() => null}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={"No Data"}
      options={(data || []).map((d) => ({
        value: JSON.stringify(d),
        label: d.label,
      }))}
    />
  );
};
