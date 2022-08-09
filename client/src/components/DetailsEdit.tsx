import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { jobType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "@mui/material/Skeleton";
import { ConstructionOutlined } from "@mui/icons-material";

const DetailsEdit = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const titleRef = useRef();
  const companyRef = useRef();
  const locationRef = useRef();
  const jdRef = useRef();
  const statusRef = useRef();
  const applyDateRef = useRef();
  const hrEmailRef = useRef();
  const jobNoteRef = useRef();

  const [job, setJob] = useState<jobType>({
    id: "",
    title: "",
    company: "",
    location: "",
    jd_link: null,
    jd_file: null,
    latest_status: "",
    application_note: "",
    application_date: "",
    hr_email: null,
  });
  const [status, setStatus] = useState(job.latest_status);
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  async function getOneJob() {
    setIsLoading(true);
    console.log("get all jobs");
    try {
      const data = await axios.post(
        "http://localhost:5001/jobs/oneJob",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          job_id: params.jobId,
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
      setJob(data.data.jobs);
      setTimeout(() => setIsLoading(false), 2000);
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  async function editJob(inputData: Omit<jobType, "id">) {
    console.log("edit jobs");
    try {
      const data = await axios.patch(
        "http://localhost:5001/jobs/job",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          jobId: params.jobId,
          title: inputData.title,
          company: inputData.company,
          location: inputData.location,
          jd_link: inputData.jd_link,
          jd_file: inputData.jd_file,
          latest_status: inputData.latest_status,
          application_date: inputData.application_date,
          hr_email: inputData.hr_email,
          application_note: inputData.application_note,
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
      navigate(`/detail/${params.jobId}`);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit() {
    // @ts-ignore
    const title = titleRef.current.value;
    // @ts-ignore
    const company = companyRef.current.value;
    // @ts-ignore
    const location = locationRef.current.value;
    // @ts-ignore
    const jd_link = jdRef.current.value;
    const jd_file = null;
    // @ts-ignore
    const latest_status = status;
    // @ts-ignore
    const application_date = applyDateRef.current.value;
    // @ts-ignore
    const hr_email = hrEmailRef.current.value;
    // @ts-ignore
    const application_note = jobNoteRef.current.value;

    editJob({
      title,
      company,
      location,
      jd_link,
      jd_file,
      latest_status,
      application_date,
      hr_email,
      application_note,
    });
    console.log("submit");
  }

  useEffect(() => {
    getOneJob();
  }, []);

  return (
    <div>
      <Button variant="contained" sx={{ width: "50px" }} onClick={handleSubmit}>
        Save
      </Button>

      <h2>
        {isLoading ? (
          <Skeleton animation="wave" width="20%" />
        ) : (
          <TextField
            id="filled-textarea"
            placeholder="Placeholder"
            defaultValue={job.title}
            variant="filled"
            inputRef={titleRef}
            inputProps={{ style: { padding: 8 } }}
            sx={{ width: "25vw" }}
          />
        )}
      </h2>

      <table>
        <tr>
          <td>Company</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <TextField
                id="filled-textarea"
                placeholder="Placeholder"
                defaultValue={job.company}
                variant="filled"
                inputRef={companyRef}
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>Location</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <TextField
                id="filled-textarea"
                placeholder="Placeholder"
                defaultValue={job.location}
                variant="filled"
                inputRef={locationRef}
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>Job Description</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <TextField
                id="filled-textarea"
                defaultValue={job.jd_link}
                variant="filled"
                inputRef={jdRef}
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
              ></TextField>
            )}
          </td>
        </tr>
        <tr>
          <td>Status</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <Autocomplete
                {...defaultProps}
                renderInput={(params: any) => (
                  <TextField {...params} variant="standard" />
                )}
                defaultValue={job.latest_status}
                value={status || job.latest_status}
                onChange={(object: any, value: any) => {
                  setStatus(value);
                }}
                ref={statusRef}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>Apply Date</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <TextField
                id="filled-textarea"
                defaultValue={job.application_date.split("T")[0]}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                type="date"
                inputRef={applyDateRef}
                sx={{ width: "25vw" }}
              ></TextField>
            )}
          </td>
        </tr>
        <tr>
          <td>Contact Person</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <TextField
                id="filled-textarea"
                defaultValue={job.hr_email}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
                type="email"
                inputRef={hrEmailRef}
              ></TextField>
            )}
          </td>
        </tr>
        <tr>
          <td>Job Note</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <TextField
                id="filled-multiline-static"
                multiline
                rows={4}
                defaultValue={job.application_note.split("T")[0]}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
                inputRef={jobNoteRef}
              />
            )}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default DetailsEdit;
