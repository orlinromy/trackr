import React, { useState } from "react";
// import axios from "axios";
import axios, { AxiosResponse } from "axios";
import * as customType from "../types/type";

const Register = () => {
  const [data, setData] = useState<customType.registerInputData>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<customType.userInputError>();

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
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={handleChange}
          value={data.password}
        ></input>
        <br />
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          onChange={handleChange}
          value={data.name}
        ></input>
        {error &&
          error.message.map(
            (msg) => msg && <p style={{ color: "red" }}>{msg.msg}</p>
          )}
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
