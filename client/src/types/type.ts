type loginData = {
  access: string;
  refresh: string;
  loginUser: object[];
};

type registerInputData = {
  email: string;
  password: string;
  name: string;
};

type loginInputData = {
  email: string;
  password: string;
};

type userInputError = {
  message: string[];
};

export type { loginData, registerInputData, loginInputData, userInputError };
