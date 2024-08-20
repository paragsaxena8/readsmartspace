import { useAuth } from "../../utils/context/AuthContext";

export const Dashboard = () => {
  let { user } = useAuth();
  if (!user) {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  return (
    <div>
      <h1>Hi {user.name}</h1>
      <p>Welcome to the Dashboard</p>
    </div>
  );
};
