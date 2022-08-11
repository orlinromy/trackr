import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { jobType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import NotesIcon from "@mui/icons-material/Notes";
import Skeleton from "@mui/material/Skeleton";

const DetailsView = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
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

  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    getOneJob();
  }, []);

  return (
    <>
      <div className="pl-36">
        <br />
        <Button
          onClick={() => {
            navigate(`/detail/edit/${params.jobId}`);
          }}
          variant="outlined"
          className="mb-6"
        >
          Edit
        </Button>

        <h2 className="text-3xl" style={{ fontWeight: "bold" }}>
          {isLoading ? <Skeleton animation="wave" width="20%" /> : job.title}
        </h2>
        <table>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <BusinessIcon className="mr-2"></BusinessIcon>
              Company
            </td>
            <td className="pt-5 items-center">
              {isLoading ? (
                <Skeleton animation="wave" width="20%" />
              ) : (
                job.company
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <LocationOnIcon className="mr-2"></LocationOnIcon>
              Location
            </td>
            <td className="pt-5 items-center">
              {isLoading ? (
                <Skeleton animation="wave" width="20%" />
              ) : (
                job.location
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <DescriptionIcon className="mr-2"></DescriptionIcon>
              Job Description
            </td>
            <td className="pt-5 items-center">
              {isLoading ? (
                <Skeleton animation="wave" width="20%" />
              ) : job.jd_link ? (
                <a href={job.jd_link as string} className="text-sky-500">
                  Link
                </a>
              ) : (
                <span style={{ color: "lightgrey" }}>No description</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <ArrowDropDownCircleIcon className="mr-2" />
              Status
            </td>
            <td className="pt-5 items-center">
              {isLoading ? (
                <Skeleton animation="wave" width="20%" />
              ) : (
                <Chip label={job.latest_status}></Chip>
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <EventNoteIcon className="mr-2" />
              Apply Date
            </td>
            <td className="pt-5 items-center">
              {isLoading ? (
                <Skeleton animation="wave" width="20%" />
              ) : job.application_date ? (
                new Date(job.application_date)
                  .toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, " ")
              ) : (
                <p style={{ display: "inline", color: "lightgrey" }}>
                  Not applied yet
                </p>
              )}
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <ContactMailIcon className="mr-2"></ContactMailIcon>Contact Person
            </td>
            <td className="pt-5 items-center">
              {
                isLoading ? (
                  <Skeleton animation="wave" width="20%" />
                ) : job.hr_email !== "" && job.hr_email !== null ? (
                  <a href={"mailto:" + job.hr_email} className="text-sky-500">
                    {job.hr_email}
                  </a>
                ) : (
                  <span style={{ color: "lightgrey" }}>No email set</span>
                )
                // job.hr_email || (
                //   <span style={{ color: "lightgrey" }}>No email set</span>
                // )
              }
            </td>
          </tr>
          <tr>
            <td className="w-[10vw] pt-5 flex items-center">
              <NotesIcon className="mr-2" /> Job Notes
            </td>
            <td className="pt-5">
              {isLoading ? (
                <Skeleton animation="wave" width="70vw" height={300} />
              ) : (
                <div
                  style={{
                    border: "solid grey 0.5px",
                    borderRadius: "10px",
                    width: "70vw",
                    minHeight: "300px",
                  }}
                >
                  {job.application_note ? (
                    <p style={{ margin: "10px" }}>{job.application_note}</p>
                  ) : (
                    <p style={{ margin: "10px", color: "lightgrey" }}>
                      No notes yet...
                    </p>
                  )}
                </div>
              )}
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default DetailsView;
