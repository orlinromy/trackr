import React, { useState, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import * as customType from "../types/type";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<customType.registerInputData>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<customType.userInputError>();
  const authCtx = useContext(AuthContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setData((prevState) => {
      return { ...prevState, [e.target.id]: e.target.value };
    });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      console.log("submit login");
      await axios.put("http://localhost:5001/users/register", data);
      const loginData = await axios.post<customType.loginData>(
        "http://localhost:5001/sessions/login",
        { email: data.email, password: data.password }
      );
      console.log(loginData);
      authCtx.setCredentials(loginData.data);
      localStorage.setItem("access", loginData.data.access);
      localStorage.setItem("refresh", loginData.data.refresh);
      navigate("/");
    } catch (error: any) {
      console.log(error.response.data);
      setError({
        message: error.response.data.message,
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          onChange={handleChange}
          value={data.email}
        ></input>
        {error && <p style={{ color: "red" }}>{error.message[2]}</p>}
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={handleChange}
          value={data.password}
        ></input>
        {error && <p style={{ color: "red" }}>{error.message[1]}</p>}
        <br />
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          onChange={handleChange}
          value={data.name}
        ></input>
        {error && <p style={{ color: "red" }}>{error.message[0]}</p>}
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
