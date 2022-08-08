import React, { useState } from "react";
// import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import * as customType from "./types/type";
import Navbar from "./components/Navbar";

function App() {
  const authCtxDefaultValue = {
    credentials: { access: "", refresh: "" },
    setCredentials: (state: customType.loginData) => {}, // noop default callback
  };
  const [credentials, setCredentials] = useState(
    authCtxDefaultValue.credentials
  );

  return (
    <div className="App">
      <header className="App-header">
        <AuthContext.Provider value={{ credentials, setCredentials }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthContext.Provider>
      </header>
    </div>
  );
}

export default App;
