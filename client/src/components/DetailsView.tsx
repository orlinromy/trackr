import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { jobType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Chip } from "@mui/material";

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
      setTimeout(() => setIsLoading(false), 2000);
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
    <div>
      <br />
      <Button
        onClick={() => {
          navigate(`/detail/edit/${params.jobId}`);
        }}
      >
        Edit
      </Button>

      <h2>
        {isLoading ? <Skeleton animation="wave" width="20%" /> : job.title}
      </h2>
      <table>
        <tr>
          <td>Company</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" width="200px" />
            ) : (
              job.company
            )}
          </td>
        </tr>
        <tr>
          <td>Location</td>
          <td>{isLoading ? <Skeleton animation="wave" /> : job.location}</td>
        </tr>
        <tr>
          <td>Job Description</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              job.jd_link ||
              job.jd_file || (
                <span style={{ color: "lightgrey" }}>No description</span>
              )
            )}
          </td>
        </tr>
        <tr>
          <td>Status</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <Chip label={job.latest_status}></Chip>
            )}
          </td>
        </tr>
        <tr>
          <td>Apply Date</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              new Date(job.application_date)
                .toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                .replace(/ /g, " ")
            )}
          </td>
        </tr>
        <tr>
          <td>Contact Person</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              job.hr_email || (
                <span style={{ color: "lightgrey" }}>No email set</span>
              )
            )}
          </td>
        </tr>
        <tr>
          <td>Job Note</td>
          <td>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <div
                style={{
                  border: "solid grey 0.5px",
                  width: "400px",
                  height: "300px",
                }}
              >
                <p>{job.application_note}</p>
              </div>
            )}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default DetailsView;
