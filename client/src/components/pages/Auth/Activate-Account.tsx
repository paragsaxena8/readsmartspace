import { Button, Result } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ActivateAccount = () => {
  const [validToken, setValidToken] = useState(false);
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenValue = searchParams.get("token");

  useEffect(() => {
    axios
      .get("/api/v1/auth/activate", {
        params: { token: tokenValue },
      })
      .then((res) => {
        console.log("🚀 ~ .then ~ res:", res);
        setValidToken(true);
      })
      .catch((err) => {
        setOutput(err.response.data.message);
        setValidToken(false);
      });
    return () => {};
  }, [tokenValue]);

  return (
    <div>
      {validToken ? (
        <Result
          status="success"
          title="Account activated successfully!"
          subTitle="You can now login to your account."
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Account activation failed!"
          subTitle={output}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>,
          ]}
        />
      )}
    </div>
  );
};
