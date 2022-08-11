import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { jobType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "@mui/material/Skeleton";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import NotesIcon from "@mui/icons-material/Notes";
import WorkIcon from "@mui/icons-material/Work";

const DetailsEdit = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const titleRef = useRef();
  const companyRef = useRef();
  const locationRef = useRef();
  const jdRef = useRef();
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
      setTimeout(() => setIsLoading(false), 500);
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
          latest_status: inputData.latest_status || job.latest_status,
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
    <div className="pl-36 mt-[20px] ">
      <div className="mb-6">
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
            navigate(`/detail/${params.jobId}`);
          }}
          className="ml-4"
        >
          Cancel
        </Button>
      </div>
      <div>
        <table>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <WorkIcon className="mr-2" />
              Job Title
            </td>
            <td>
              {isLoading ? (
                <Skeleton animation="wave" width="20%" />
              ) : (
                <TextField
                  id="filled-textarea"
                  placeholder="Job Title"
                  defaultValue={job.title}
                  variant="filled"
                  inputRef={titleRef}
                  inputProps={{ style: { padding: 8 } }}
                  className="pt-2"
                  sx={{ width: "25vw", height: "36px" }}
                />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <BusinessIcon className="mr-2"></BusinessIcon>
              Company
            </td>
            <td>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                <TextField
                  id="filled-textarea"
                  placeholder="Company"
                  defaultValue={job.company}
                  variant="filled"
                  inputRef={companyRef}
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "25vw" }}
                  className="pt-2"
                />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <LocationOnIcon className="mr-2"></LocationOnIcon>
              Location
            </td>
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
                  className="pt-2"
                />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <DescriptionIcon className="mr-2"></DescriptionIcon>
              Job Description
            </td>
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
                  className="pt-2"
                ></TextField>
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <ArrowDropDownCircleIcon className="mr-2" />
              Status
            </td>
            <td>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                <Autocomplete
                  {...defaultProps}
                  renderInput={(params: any) => (
                    <TextField {...params} variant="standard" />
                  )}
                  sx={{ width: "25vw" }}
                  className="pt-4"
                  defaultValue={job.latest_status}
                  value={status || job.latest_status}
                  onChange={(object: any, value: any) => {
                    setStatus(value);
                  }}
                />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <EventNoteIcon className="mr-2" />
              Apply Date
            </td>
            <td>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                <TextField
                  id="filled-textarea"
                  className="pt-2"
                  defaultValue={
                    job.application_date &&
                    new Date(
                      new Date(job.application_date).getTime() -
                        new Date(job.application_date).getTimezoneOffset() *
                          60000
                    )
                      .toISOString()
                      .split("T")[0]
                    // new Date(job.application_date).toLocaleDateString("en-SG", {
                    //   timeZone: "Asia/Singapore",
                    // })
                  }
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
            <td className="w-[10vw] pt-5 flex items-center">
              <ContactMailIcon className="mr-2"></ContactMailIcon>Contact Person
            </td>
            <td>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                <TextField
                  id="filled-textarea"
                  className="pt-2"
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
            <td className="w-[10vw] pt-5 flex items-center">
              <NotesIcon className="mr-2" /> Job Notes
            </td>
            <td>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                <TextField
                  id="filled-multiline-static"
                  className="pt-2"
                  multiline
                  rows={6}
                  defaultValue={job.application_note}
                  variant="filled"
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "75vw" }}
                  inputRef={jobNoteRef}
                />
              )}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default DetailsEdit;
