import React, { useState, useContext, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import * as customType from "../types/type";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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

  // useEffect(() => {
  //   if (authCtx.credentials.access !== "" || localStorage.getItem("access")) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <div className="flex border rounded-xl shadow-xl justify-center items-center mt-[20vh] ml-[15vw] py-20 w-[70vw]">
      <div className="flex">
        <div className="w-[30vw]">
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              onChange={handleChange}
              value={data.email}
              required
              className="w-[80%] py-1 px-1 bg-stone-100 border border-stone-200 mb-6"
            ></input>
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              onChange={handleChange}
              value={data.password}
              required
              className="w-[80%] py-1 px-1 bg-stone-100 border border-stone-200"
            ></input>
            <br />
            {error &&
              error.message.map(
                (msg) => msg && <p style={{ color: "red" }}>{msg}</p>
              )}
            <button
              type="submit"
              className="bg-sky-200 px-6 py-1 mt-[20px] border rounded border-sky-300"
            >
              Log in
            </button>
            <p className="mt-4">
              Don't have an account yet?{" "}
              <a href="/register" className="text-sky-500 ">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
      <div className="w-[30vw] text-center ">
        <p className="text-2xl mb-6">Welcome back!</p>
        <p>
          No pressure - you've got{" "}
          {Math.round(
            (new Date(2023, 2, 12).getTime() - new Date(Date.now()).getTime()) /
              86400000
          ).toString()}{" "}
          more days 😉
        </p>
        <img src={require("../assets/loginpage.jpg")} className="mx-auto"></img>
        <p className="text-sm">
          <a
            href="https://www.freepik.com/vectors/looking-forward"
            className="text-sky-600"
          >
            Looking forward vector created by pch.vector - www.freepik.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
