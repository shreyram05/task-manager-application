import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Button from "./Button";

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Button
  color="red"
  onClick={handleLogout}
>
  Logout
</Button>
  );
}

export default Logout;