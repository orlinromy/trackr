type loginData = {
  access: string;
  refresh: string;
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

type jobType = {
  id: string;
  title: string;
  company: string;
  location: string;
  jd_link: string | null;
  jd_file: string | null;
  latest_status: string;
  application_note: string | null;
  application_date: string;
  hr_email: string | null;
};

type interviewType = {
  id: string;
  stage: number;
  type: string;
  date: string;
  has_assignment: boolean;
  assignment_details: string | null;
  interview_note: string | null;
  job_id: string;
  interviewer_name: string | null;
  interviewer_email: string | null;
  interviewer_title: string | null;
};

export type {
  loginData,
  registerInputData,
  loginInputData,
  userInputError,
  jobType,
  interviewType,
};
