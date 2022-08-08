import React, { useContext } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  async function logout() {
    console.log("logging out...");
    const token = authCtx.credentials.access || localStorage.getItem("access");
    if (token) {
      const data = await axios.patch(
        "http://localhost:5001/sessions/logout",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
        },
        {
          headers: {
            //@ts-ignore
            Authorization:
              authCtx.credentials.access || localStorage.getItem("access"),
          },
        }
      );
      console.log(data);
      localStorage.clear();
      authCtx.setCredentials({ access: "", refresh: "" });
      navigate("/login");
    }
  }

  return (
    <div>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Navbar;
