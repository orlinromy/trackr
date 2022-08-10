import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { interviewType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Chip } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const DetailsInterviewView = () => {
  const navigate = useNavigate();
  const dateRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const titleRef = useRef();
  const noteRef = useRef();
  const authCtx = useContext(AuthContext);
  const [interviews, setInterviews] = useState<interviewType[]>([
    {
      id: "",
      stage: 0,
      type: "",
      date: "",
      has_assignment: false,
      assignment_details: null,
      interview_note: null,
      job_id: "",
      interviewer_name: null,
      interviewer_email: null,
      interviewer_title: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState<boolean>(false);
  const [deletedInterview, setDeletedInterview] =
    useState<interviewType | null>(null);
  const params = useParams();
  const [editInterview, setEditInterview] = useState<interviewType | null>(
    null
  );
  const [interviewType, setInterviewType] = useState<string>("");
  const interviewTypes: string[] = [
    "PHONE",
    "BEHAVIORAL",
    "TECHNICAL",
    "GROUP",
    "CEO_INTERVIEW",
    "CROSS_TEAM",
  ];

  const defaultProps = {
    options: interviewTypes,
    getOptionLabel: (type: string) => type,
  };

  async function getOneJobInterviews() {
    setIsLoading(true);
    console.log("get all interviews");
    try {
      const data = await axios.post(
        "http://localhost:5001/interviews/oneInterview",
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
      setInterviews(data.data.interview);
      // await getAllInterviews();
      setTimeout(() => setIsLoading(false), 1500);
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function displayInterviewer(
    name: string | null,
    email: string | null,
    title: string | null
  ) {
    if (!name && !email && !title) {
      return <p style={{ color: "lightgrey" }}>N/A</p>;
    } else if (email) {
      if (!name && !title) {
        return <a href={`mailto:${email}`}>{email}</a>;
      } else if (!name) {
        return <a href={`mailto:${email}`}>{title}</a>;
      } else if (!title) {
        return <a href={`mailto:${email}`}>{name}</a>;
      } else {
        return (
          <a href={`mailto:${email}`}>
            {name} ({title})
          </a>
        );
      }
    } else {
      if (!name) {
        return <p>{title}</p>;
      } else if (!title) {
        return <p>{name}</p>;
      } else {
        return (
          <p>
            {name} ({title})
          </p>
        );
      }
    }
  }

  function handleDeleteInterview(deleteInterview: interviewType) {
    // open the snack bar
    setIsSnackBarOpen(true);
    // store the deleted interview id somewhere first
    setDeletedInterview(deleteInterview);
    setInterviews((prevState) =>
      prevState.filter((interview) => interview.id !== deleteInterview.id)
    );
    //
  }

  function handleUndo() {
    setInterviews((prevState) =>
      [...prevState, deletedInterview as interviewType].sort(
        (a, b) => a.stage - b.stage
      )
    );
  }

  async function deleteInterview() {
    console.log("get all interviews");
    try {
      const data = await axios.delete(
        "http://localhost:5001/interviews/interview",
        {
          headers: {
            //@ts-ignore
            Authorization:
              authCtx.credentials.access || localStorage.getItem("access"),
          },
          data: {
            refreshToken:
              authCtx.credentials.refresh || localStorage.getItem("refresh"),
            job_id: params.jobId,
            interview_id: (deletedInterview as interviewType).id,
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
      // await getAllInterviews();
      setDeletedInterview(null);
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function handleSnackBarClose() {
    setIsSnackBarOpen(false);
    deleteInterview();
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleUndo}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  type editInterviewInputType = {
    type: string;
    date: string;
    interviewer_name: string | null;
    interviewer_email: string | null;
    interviewer_title: string | null;
    interview_note: string | null;
  };
  async function updateInterview(inputData: editInterviewInputType) {
    try {
      const data = await axios.patch(
        "http://localhost:5001/interviews/interview",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          job_id: params.jobId,
          // @ts-ignore
          interview_id: editInterview.id,
          // @ts-ignore
          stage: editInterview.stage,
          has_assignment: false,
          assignment_detail: null,
          type: inputData.type,
          date: inputData.date,
          interviewer_name: inputData.interviewer_name,
          interviewer_email: inputData.interviewer_email,
          interviewer_title: inputData.interviewer_title,
          interview_note: inputData.interview_note,
        },
        {
          headers: {
            //@ts-ignore
            Authorization:
              authCtx.credentials.access || localStorage.getItem("access"),
          },
        }
      );
      setEditInterview(null);
      getOneJobInterviews();
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditInterview(interview: interviewType) {
    setEditInterview(interview);
  }

  function handleEdit() {
    // @ts-ignore
    const type = interviewType || editInterview.type;

    //@ts-ignore
    const date = dateRef.current.value;
    //@ts-ignore
    const interviewer_name = nameRef.current.value;
    //@ts-ignore
    const interviewer_email = emailRef.current.value;
    //@ts-ignore
    const interviewer_title = titleRef.current.value;
    //@ts-ignore
    const interview_note = noteRef.current.value;

    updateInterview({
      type,
      date,
      interviewer_name,
      interviewer_title,
      interviewer_email,
      interview_note,
    });
  }

  useEffect(() => {
    getOneJobInterviews();
  }, []);

  return (
    <>
      <Button>Edit</Button>
      <h3>Interviews</h3>

      {!isLoading && interviews.length === 0 ? (
        <p style={{ color: "lightgrey" }}>No interviews set</p>
      ) : (
        interviews.map((interview) => {
          if (
            !editInterview ||
            interview.id !== (editInterview as interviewType).id
          ) {
            return (
              <>
                {isLoading ? (
                  <h3>
                    <Skeleton animation="wave" width="15%"></Skeleton>
                  </h3>
                ) : (
                  <div>
                    <span>
                      <h4 style={{ display: "inline" }}>
                        Interview {"#" + interview.stage}
                      </h4>
                      <IconButton
                        onClick={() => handleDeleteInterview(interview)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditInterview(interview)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </div>
                )}
                <table style={{ textAlign: "center", width: "50%" }}>
                  <thead>
                    <tr>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Type"
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Date"
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Interviewer"
                        )}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        interview.type
                      )}
                    </td>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        new Date(interview.date)
                          .toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, " ")
                      )}
                    </td>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        displayInterviewer(
                          interview.interviewer_name,
                          interview.interviewer_email,
                          interview.interviewer_title
                        )
                      )}
                    </td>
                  </tbody>
                </table>
                <p style={{ fontWeight: "bold" }}>Interview notes</p>
                <div style={{ border: "solid grey 0.5px", width: "70%" }}>
                  {interview.interview_note ? (
                    <p>{interview.interview_note}</p>
                  ) : (
                    <p style={{ color: "lightgrey" }}>No notes yet</p>
                  )}
                </div>
              </>
            );
          } else {
            return (
              <>
                {isLoading ? (
                  <h3>
                    <Skeleton animation="wave" width="15%"></Skeleton>
                  </h3>
                ) : (
                  <span>
                    <h4 style={{ display: "inline" }}>
                      Interview {"#" + interview.stage}
                    </h4>
                    <IconButton onClick={() => handleEdit()}>
                      <TaskAltIcon fontSize="small" />
                    </IconButton>
                  </span>
                )}
                <table style={{ textAlign: "center", width: "50%" }}>
                  <thead>
                    <tr>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Type"
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Date"
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Interviewer Name"
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Interviewer Email"
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton animation="wave"></Skeleton>
                        ) : (
                          "Interviewer Title"
                        )}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        <Autocomplete
                          {...defaultProps}
                          renderInput={(params: any) => (
                            <TextField {...params} variant="standard" />
                          )}
                          defaultValue={interview.type}
                          value={interviewType || interview.type}
                          onChange={(object: any, value: any) => {
                            setInterviewType(value);
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        <TextField
                          id="filled-textarea"
                          defaultValue={interview.date.split("T")[0]}
                          variant="filled"
                          inputProps={{ style: { padding: 8 } }}
                          type="date"
                          inputRef={dateRef}
                          sx={{ width: "25vw" }}
                        ></TextField>
                      )}
                    </td>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        <TextField
                          id="filled-textarea"
                          defaultValue={interview.interviewer_name}
                          variant="filled"
                          inputProps={{ style: { padding: 8 } }}
                          sx={{ width: "25vw" }}
                          type="email"
                          inputRef={nameRef}
                        ></TextField>
                      )}
                    </td>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        <TextField
                          id="filled-textarea"
                          defaultValue={interview.interviewer_email}
                          variant="filled"
                          inputProps={{ style: { padding: 8 } }}
                          sx={{ width: "25vw" }}
                          type="email"
                          inputRef={emailRef}
                        ></TextField>
                      )}
                    </td>
                    <td>
                      {isLoading ? (
                        <Skeleton animation="wave"></Skeleton>
                      ) : (
                        <TextField
                          id="filled-textarea"
                          defaultValue={interview.interviewer_title}
                          variant="filled"
                          inputProps={{ style: { padding: 8 } }}
                          sx={{ width: "25vw" }}
                          type="email"
                          inputRef={titleRef}
                        ></TextField>
                      )}
                    </td>
                  </tbody>
                </table>
                <p style={{ fontWeight: "bold" }}>Interview notes</p>
                <TextField
                  id="filled-multiline-static"
                  multiline
                  rows={4}
                  defaultValue={interview.interview_note}
                  variant="filled"
                  inputProps={{ style: { padding: 8 } }}
                  sx={{ width: "80vw" }}
                  inputRef={noteRef}
                />
              </>
            );
          }
        })
      )}
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Interview deleted"
        action={action}
      />
    </>
  );
};

export default DetailsInterviewView;
