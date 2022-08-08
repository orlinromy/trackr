import React, { useState, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import * as customType from "../types/type";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<customType.loginInputData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<customType.userInputError>();
  const authCtx = useContext(AuthContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setData((prevState) => {
      return { ...prevState, [e.target.id]: e.target.value };
    });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      console.log("submit login");
      const res = await axios.post<customType.loginData>(
        "http://localhost:5001/sessions/login",
        data
      );
      authCtx.setCredentials(res.data);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/");
    } catch (error: any) {
      console.log(error.response.data.message);
      setError({ message: Array.from(new Set(error.response.data.message)) });
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          onChange={handleChange}
          value={data.email}
        ></input>
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={handleChange}
          value={data.password}
        ></input>
        <br />
        {error &&
          error.message.map(
            (msg) => msg && <p style={{ color: "red" }}>{msg}</p>
          )}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
