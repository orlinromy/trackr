import React, { useState, useRef, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { jobType, interviewType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import NotesIcon from "@mui/icons-material/Notes";
import WorkIcon from "@mui/icons-material/Work";
import Divider from "@mui/material/Divider";

const AddApplication = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [job, setJob] = useState<jobType>({
    id: "",
    title: "",
    company: "",
    location: "",
    jd_link: "",
    jd_file: null,
    latest_status: "APPLIED",
    application_note: "",
    application_date: new Date(Date.now()).toISOString().split("T")[0],
    // application_date: "",
    hr_email: "",
  });

  const initialInterviewData: interviewType = {
    id: "",
    stage: 0,
    type: "PHONE",
    date: new Date(Date.now()).toISOString().split("T")[0],
    has_assignment: false,
    assignment_details: null,
    interview_note: "",
    job_id: "",
    interviewer_name: "",
    interviewer_email: "",
    interviewer_title: "",
  };

  const [interviews, setInterviews] = useState<interviewType[]>([]);
  // const titleRef = useRef<HTMLInputElement | null>(null);
  // const companyRef = useRef<HTMLInputElement | null>(null);
  // const locationRef = useRef<HTMLInputElement | null>(null);
  // const jdRef = useRef<HTMLInputElement | null>(null);
  // const applyDateRef = useRef<HTMLInputElement | null>(null);
  // const hrEmailRef = useRef<HTMLInputElement | null>(null);
  // const jobNoteRef = useRef<HTMLInputElement | null>(null);
  // const [status, setStatus] = useState(job.latest_status);
  const applicationStatuses: string[] = [
    "WISHLIST",
    "APPLIED",
    "PENDING_REPLY",
    "INTERVIEW",
    "OFFER_DECLINED",
    "OFFER_ACCEPTED",
    "WITHDRAWN",
    "REJECTED",
  ];

  const defaultProps = {
    options: applicationStatuses,
    getOptionLabel: (status: string) => status,
  };
  function addNewInterviewField() {
    setInterviews((prevState) => [...prevState, { ...initialInterviewData }]);
  }
  const interviewTypes: string[] = [
    "PHONE",
    "BEHAVIORAL",
    "TECHNICAL",
    "GROUP",
    "CEO_INTERVIEW",
    "CROSS_TEAM",
  ];

  const interviewDefaultProps = {
    options: interviewTypes,
    getOptionLabel: (type: string) => type,
  };

  function handleChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newState = JSON.parse(JSON.stringify(interviews));
    if (e.currentTarget.id === "date") {
      newState[idx][e.currentTarget.id] = new Date(e.currentTarget.value)
        .toISOString()
        .split("T")[0];
    } else {
      newState[idx][e.currentTarget.id] = e.currentTarget.value;
    }

    setInterviews(newState);
  }
  async function addNewInterviews(jobId: string) {
    try {
      console.log("adding new interviews");
      setInterviews((prevState) =>
        prevState.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );

      const data = await axios.put(
        "http://localhost:5001/interviews/interview",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          job_id: jobId,
          interviews,
        },
        {
          headers: {
            //@ts-ignore
            Authorization:
              authCtx.credentials.access || localStorage.getItem("access"),
          },
        }
      );
      console.log(data.data);

      if (data.data.access) {
        authCtx.setCredentials({
          ...authCtx.credentials,
          access: data.data.access,
        });
        localStorage.setItem("access", data.data.access);
      }

      navigate(`/detail/${jobId}`);
    } catch (error) {
      console.log(error);
    }
  }

  async function addNewApplication(inputData: Omit<jobType, "id">) {
    try {
      console.log("adding new application");
      const data = await axios.put(
        "http://localhost:5001/jobs/job",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          title: inputData.title,
          company: inputData.company,
          location: inputData.location,
          jd_link: inputData.jd_link,
          jd_file: inputData.jd_file,
          latest_status: inputData.latest_status,
          application_note: inputData.application_note,
          application_date: inputData.application_date,
          hr_email: inputData.hr_email,
        },
        {
          headers: {
            //@ts-ignore
            Authorization:
              authCtx.credentials.access || localStorage.getItem("access"),
          },
        }
      );
      if (data.data.access) {
        authCtx.setCredentials({
          ...authCtx.credentials,
          access: data.data.access,
        });
        localStorage.setItem("access", data.data.access);
      }
      console.log(data.data);
      console.log("adding new application successful");

      if (interviews.length !== 0) {
        addNewInterviews(data.data.newJob[0].id);
      } else {
        navigate(`/detail/${data.data.newJob[0].id}`);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function handleSubmit() {
    // const title = titleRef.current!.value;
    // const company = companyRef.current!.value;
    // const location = locationRef.current!.value;
    // const jd_link = jdRef.current!.value;
    // const application_date = applyDateRef.current!.value;
    // const hr_email = hrEmailRef.current!.value;
    // const application_note = jobNoteRef.current!.value;
    // const latest_status = status;
    if (!job.title || !job.company) {
      alert("Please input the job title and the company");
    } else {
      addNewApplication(job);
    }
  }

  function handleJobChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newState = JSON.parse(JSON.stringify(job));
    if (e.currentTarget.id === "application_date") {
      newState[e.currentTarget.id] = new Date(e.currentTarget.value)
        .toISOString()
        .split("T")[0];
    } else {
      newState[e.currentTarget.id] = e.currentTarget.value;
    }
    console.log(newState);
    setJob(newState);
  }
  return (
    <div>
      <Navbar />
      <div>
        <Button
          className="pl-5"
          onClick={() => {
            navigate("/");
          }}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
      </div>
      <div className="pl-36 mt-[20px]">
        <Button
          variant="contained"
          sx={{ width: "50px" }}
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button
          sx={{ width: "50px" }}
          onClick={() => {
            navigate("/");
          }}
          className="ml-4"
        >
          Cancel
        </Button>
        {/*         
        <div>
          <TextField
            id="title"
            placeholder="Job Title"
            // defaultValue={job.title}
            value={job.title}
            onChange={(e) => {
              handleJobChange(e);
            }}
            variant="filled"
            // inputRef={titleRef}
            inputProps={{ style: { padding: 8 } }}
            sx={{ width: "25vw" }}
          />
        </div> */}
        <table>
          <tbody>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <WorkIcon className="mr-2" />
                Job Title
              </td>
              <td>
                <TextField
                  id="title"
                  placeholder="Job Title"
                  // defaultValue={job.title}
                  value={job.title}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  variant="filled"
                  // inputRef={titleRef}
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "25vw" }}
                  className="pt-2"
                />
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <BusinessIcon className="mr-2"></BusinessIcon>
                Company
              </td>
              <td>
                <TextField
                  id="company"
                  placeholder="Company"
                  // defaultValue={job.company}
                  value={job.company}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  variant="filled"
                  // inputRef={companyRef}
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "25vw" }}
                  className="pt-2"
                />
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <LocationOnIcon className="mr-2"></LocationOnIcon>
                Location
              </td>
              <td>
                <TextField
                  id="location"
                  placeholder="Location (e.g. Singapore)"
                  // defaultValue={job.location}
                  value={job.location}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  variant="filled"
                  // inputRef={locationRef}
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "25vw" }}
                  className="pt-2"
                />
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <DescriptionIcon className="mr-2"></DescriptionIcon>
                Job Description
              </td>
              <td>
                <TextField
                  id="jd_link"
                  placeholder="Link to Job Description"
                  // defaultValue={job.jd_link}
                  value={job.jd_link}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  variant="filled"
                  // inputRef={jdRef}
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "25vw" }}
                  className="pt-2"
                ></TextField>
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <ArrowDropDownCircleIcon className="mr-2" />
                Status
              </td>
              <td>
                <Autocomplete
                  {...defaultProps}
                  renderInput={(params: any) => (
                    <TextField {...params} variant="standard" />
                  )}
                  id="latest_status"
                  // defaultValue={job.latest_status}
                  value={job.latest_status}
                  className="pt-4 w-[25vw]"
                  onChange={(
                    e: React.SyntheticEvent<Element, Event>,
                    value: any
                  ) => {
                    setJob((prevState: jobType) => {
                      const newState = JSON.parse(JSON.stringify(prevState));
                      newState.latest_status = value;
                      if (value === "WISHLIST") {
                        newState.application_date = "";
                      }
                      // console.log(newState);
                      return newState;
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <EventNoteIcon className="mr-2" />
                Apply Date
              </td>
              <td>
                <TextField
                  id="application_date"
                  // defaultValue={job.application_date.split("T")[0]}
                  value={job.application_date.split("T")[0]}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  placeholder="Apply date"
                  variant="filled"
                  inputProps={{ style: { padding: 8 } }}
                  type="date"
                  // inputRef={applyDateRef}
                  sx={{ width: "25vw" }}
                  className="pt-2"
                ></TextField>
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <ContactMailIcon className="mr-2"></ContactMailIcon>Contact
                Person
              </td>
              <td>
                <TextField
                  id="hr_email"
                  // defaultValue={job.hr_email}
                  value={job.hr_email}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  variant="filled"
                  placeholder="HR email"
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "25vw" }}
                  type="email"
                  className="pt-2"
                  // inputRef={hrEmailRef}
                ></TextField>
              </td>
            </tr>
            <tr>
              <td className="w-[10vw] pt-5 flex items-center">
                <NotesIcon className="mr-2" /> Job Notes
              </td>
              <td>
                <TextField
                  id="application_note"
                  multiline
                  rows={6}
                  placeholder="More details about the job"
                  // defaultValue={job.application_note}
                  value={job.application_note}
                  onChange={(e) => {
                    handleJobChange(e);
                  }}
                  className="pt-2"
                  variant="filled"
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "75vw" }}
                  // inputRef={jobNoteRef}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Divider className="m-10" />
        <p className="text-2xl mt-8" style={{ fontWeight: "bold" }}>
          Interviews
        </p>
        <Button
          variant="contained"
          onClick={addNewInterviewField}
          className="my-5"
        >
          + Add New Interview
        </Button>
        {interviews.map((interview, idx) => (
          <>
            <table
              key={idx}
              style={{ textAlign: "center", width: "50%" }}
              className="my-8 mx-24"
            >
              <thead>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Type</td>
                  <td style={{ fontWeight: "bold" }}>Date</td>
                  <td style={{ fontWeight: "bold" }}>Interviewer Name</td>
                  <td style={{ fontWeight: "bold" }}>Interviewer Email</td>
                  <td style={{ fontWeight: "bold" }}>Interviewer Title</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Autocomplete
                      {...interviewDefaultProps}
                      renderInput={(params: any) => (
                        <TextField {...params} variant="standard" />
                      )}
                      id="type"
                      // defaultValue={interview.type}
                      value={interview.type}
                      onChange={(
                        e: React.SyntheticEvent<Element, Event>,
                        value: any
                      ) => {
                        setInterviews((prevState: interviewType[]) => {
                          const newState = JSON.parse(
                            JSON.stringify(prevState)
                          );
                          newState[idx].type = value;
                          console.log(newState);
                          return newState;
                        });
                      }}
                      sx={{ width: "13vw" }}
                    />
                  </td>
                  <td>
                    <TextField
                      id="date"
                      // defaultValue={interview.date.split("T")[0]}
                      variant="filled"
                      inputProps={{ style: { padding: 8 } }}
                      type="date"
                      sx={{ width: "13vw" }}
                      value={interview.date}
                      onChange={(e) => {
                        handleChange(idx, e);
                      }}
                    ></TextField>
                  </td>
                  <td>
                    <TextField
                      id="interviewer_name"
                      // defaultValue={interview.interviewer_name}
                      variant="filled"
                      inputProps={{ style: { padding: 8 } }}
                      sx={{ width: "13vw" }}
                      value={interview.interviewer_name}
                      onChange={(e) => {
                        handleChange(idx, e);
                      }}
                    ></TextField>
                  </td>
                  <td>
                    <TextField
                      id="interviewer_email"
                      // defaultValue={interview.interviewer_email}
                      variant="filled"
                      inputProps={{ style: { padding: 8 } }}
                      sx={{ width: "13vw" }}
                      type="email"
                      value={interview.interviewer_email}
                      onChange={(e) => {
                        handleChange(idx, e);
                      }}
                    ></TextField>
                  </td>
                  <td>
                    <TextField
                      id="interviewer_title"
                      // defaultValue={interview.interviewer_title}
                      variant="filled"
                      inputProps={{ style: { padding: 8 } }}
                      sx={{ width: "13vw" }}
                      value={interview.interviewer_title}
                      onChange={(e) => {
                        handleChange(idx, e);
                      }}
                    ></TextField>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontWeight: "bold" }}>Interview notes</p>
            <TextField
              id="interview_note"
              multiline
              rows={4}
              // defaultValue={interview.interview_note}
              value={interview.interview_note}
              onChange={(e) => {
                handleChange(idx, e);
              }}
              variant="filled"
              inputProps={{ style: { padding: 8 } }}
              sx={{ width: "80vw" }}
            />
            <Divider className="m-10" />
          </>
        ))}
      </div>
    </div>
  );
};

export default AddApplication;
