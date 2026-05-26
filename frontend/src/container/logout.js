import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../common/loader";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const run = async () => {
      await logout();
      navigate("/", { replace: true });
    };
    run();
  }, [logout, navigate]);

  return (
    <div className="mt-5 flex justify-center">
      <Loader />
    </div>
  );
};

export default Logout;
