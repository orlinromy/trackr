import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { jobType, interviewType } from "../types/type";

const AddApplication = () => {
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

  const [interviews, setInterviews] = useState<interviewType[]>([
    { ...initialInterviewData },
  ]);
  const titleRef = useRef();
  const companyRef = useRef();
  const locationRef = useRef();
  const jdRef = useRef();
  const applyDateRef = useRef();
  const hrEmailRef = useRef();
  const jobNoteRef = useRef();
  const [status, setStatus] = useState(job.latest_status);
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

  function handleSubmit() {}
  return (
    <div>
      <Button variant="contained" sx={{ width: "50px" }} onClick={handleSubmit}>
        Save
      </Button>
      <div>
        <TextField
          id="filled-textarea"
          placeholder="Job Title"
          defaultValue={job.title}
          variant="filled"
          inputRef={titleRef}
          inputProps={{ style: { padding: 8 } }}
          sx={{ width: "25vw" }}
        />
      </div>

      <table>
        <tbody>
          <tr>
            <td>Company</td>
            <td>
              <TextField
                id="filled-textarea"
                placeholder="Company"
                defaultValue={job.company}
                variant="filled"
                inputRef={companyRef}
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
              />
            </td>
          </tr>
          <tr>
            <td>Location</td>
            <td>
              <TextField
                id="filled-textarea"
                placeholder="Location (e.g. Singapore)"
                defaultValue={job.location}
                variant="filled"
                inputRef={locationRef}
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
              />
            </td>
          </tr>
          <tr>
            <td>Job Description</td>
            <td>
              <TextField
                id="filled-textarea"
                placeholder="Link to Job Description"
                defaultValue={job.jd_link}
                variant="filled"
                inputRef={jdRef}
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
              ></TextField>
            </td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
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
              />
            </td>
          </tr>
          <tr>
            <td>Apply Date</td>
            <td>
              <TextField
                id="filled-textarea"
                defaultValue={job.application_date.split("T")[0]}
                placeholder="Apply date"
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                type="date"
                inputRef={applyDateRef}
                sx={{ width: "25vw" }}
              ></TextField>
            </td>
          </tr>
          <tr>
            <td>Contact Person</td>
            <td>
              <TextField
                id="filled-textarea"
                defaultValue={job.hr_email}
                variant="filled"
                placeholder="HR email"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
                type="email"
                inputRef={hrEmailRef}
              ></TextField>
            </td>
          </tr>
          <tr>
            <td>Job Note</td>
            <td>
              <TextField
                id="filled-multiline-static"
                multiline
                rows={4}
                placeholder="More details about the job"
                defaultValue={job.application_note}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "25vw" }}
                inputRef={jobNoteRef}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Interview</h3>
      <Button variant="contained" onClick={addNewInterviewField}>
        Add New Interview
      </Button>
      {interviews.map((interview, idx) => (
        <>
          <table key={idx} style={{ textAlign: "center", width: "50%" }}>
            <thead>
              <tr>
                <td>Type</td>
                <td>Date</td>
                <td>Interviewer Name</td>
                <td>Interviewer Email</td>
                <td>Interviewer Title</td>
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
                        const newState = JSON.parse(JSON.stringify(prevState));
                        newState[idx].type = value;
                        console.log(newState);
                        return newState;
                      });
                    }}
                    sx={{ width: "20vw" }}
                  />
                </td>
                <td>
                  <TextField
                    id="date"
                    // defaultValue={interview.date.split("T")[0]}
                    variant="filled"
                    inputProps={{ style: { padding: 8 } }}
                    type="date"
                    sx={{ width: "20vw" }}
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
                    sx={{ width: "20vw" }}
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
                    sx={{ width: "20vw" }}
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
                    sx={{ width: "20vw" }}
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
        </>
      ))}
    </div>
  );
};

export default AddApplication;
