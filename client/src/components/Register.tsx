import React, { useState, useContext, useEffect } from "react";
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

  // useEffect(() => {
  //   if (authCtx.credentials.access !== "" || localStorage.getItem("access")) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <div className="flex border rounded-xl shadow-xl justify-center items-center mt-[20vh] ml-[15vw] py-20 w-[70vw]">
      <div className="flex">
        <div className="w-[30vw]">
          <form onSubmit={handleRegister}>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              onChange={handleChange}
              value={data.email}
              className="w-[80%] py-1 px-1 bg-stone-100 border border-stone-200"
            ></input>
            {error ? (
              <p className="mb-3" style={{ color: "red" }}>
                {error.message[2]}
              </p>
            ) : (
              <p className="mb-3"></p>
            )}
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              onChange={handleChange}
              value={data.password}
              className="w-[80%] py-1 px-1 bg-stone-100 border border-stone-200"
            ></input>
            {error ? (
              <p className="mb-3" style={{ color: "red" }}>
                {error.message[1]}
              </p>
            ) : (
              <p className="mb-3"></p>
            )}
            <br />
            <label htmlFor="name">Name</label>
            <br />
            <input
              id="name"
              type="text"
              onChange={handleChange}
              value={data.name}
              className="w-[80%] py-1 px-1 bg-stone-100 border border-stone-200"
            ></input>
            {error ? (
              <p className="mb-3" style={{ color: "red" }}>
                {error.message[0]}
              </p>
            ) : (
              <p className="mb-3"></p>
            )}
            <br />
            <button
              type="submit"
              className="bg-sky-200 px-6 py-1 mt-1 border rounded border-sky-300"
            >
              Register
            </button>
            <p className="mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-sky-500">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
      <div className="w-[30vw] text-center ">
        <p className="text-2xl mb-6">Welcome to Trackr!</p>
        <p>
          Trackr is a simple app that helps you track your job application.
          Create an account to start using!
        </p>
        <img
          src={require("../assets/registrationpage.jpg")}
          className="mx-auto"
        ></img>
        <p className="text-sm">
          <a
            href="https://www.freepik.com/vectors/teamwork-illustration"
            className="text-sky-600"
          >
            Teamwork illustration vector created by pch.vector - www.freepik.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
