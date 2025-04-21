
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This page is replaced by /auth
const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/auth");
  }, [navigate]);
  return null;
};
export default Login;
