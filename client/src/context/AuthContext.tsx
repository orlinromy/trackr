import React from "react";
import * as customType from "../types/type";

const authCtxDefaultValue = {
  credentials: { access: "", refresh: "" },
  setCredentials: (state: customType.loginData) => {}, // noop default callback
};

const AuthContext = React.createContext(authCtxDefaultValue);

export default AuthContext;
