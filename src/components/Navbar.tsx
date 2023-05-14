import React, { useContext } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  async function logout() {
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
      window.localStorage.clear();
      authCtx.setCredentials({ access: "", refresh: "" });
      navigate("/login");
    }
  }

  return (
    <div className="bg-stone-50 h-[7vh] border border-stone-200 mb-8 flex justify-between items-center p-6">
      <a className="block w-[5vh] " href="/">
        <img src={require("../assets/job.png")}></img>
      </a>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Navbar;
