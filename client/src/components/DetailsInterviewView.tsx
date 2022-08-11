import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { interviewType } from "../types/type";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import Slide, { SlideProps } from "@mui/material/Slide";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetailsInterviewView = () => {
  const navigate = useNavigate();

  type RouteParams = {
    jobId: string;
  };
  const params = useParams<RouteParams>();
  const dateRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const titleRef = useRef();
  const noteRef = useRef();
  const authCtx = useContext(AuthContext);
  const [isUndoClicked, setIsUndoClicked] = useState<boolean>(false);
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
  const [isAddInterview, setIsAddInterview] = useState<boolean>(false);
  const [newInterview, setNewInterview] = useState<interviewType[]>([
    {
      id: "",
      stage: 0,
      type: "PHONE",
      date: new Date(Date.now()).toISOString().split("T")[0],
      has_assignment: false,
      assignment_details: null,
      interview_note: "",
      job_id: params.jobId as string,
      interviewer_name: "",
      interviewer_email: "",
      interviewer_title: "",
    },
  ]);

  const interviewDefaultProps = {
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
      setTimeout(() => setIsLoading(false), 500);
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
    setIsUndoClicked(true);
    setInterviews((prevState) =>
      [...prevState, deletedInterview as interviewType].sort(
        (a, b) => (a.stage as number) - (b.stage as number)
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
    !isUndoClicked && deleteInterview();
    setIsUndoClicked(false);
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

  interface editInterviewInputType {
    type: string;
    date: string;
    interviewer_name: string | null;
    interviewer_email: string | null;
    interviewer_title: string | null;
    interview_note: string | null;
  }
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
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
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

  function handleAddInterviewClose() {
    setIsAddInterview(false);
  }

  function handleAddInterviewChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newState = JSON.parse(JSON.stringify(newInterview));
    if (e.currentTarget.id === "date") {
      newState[0][e.currentTarget.id] = new Date(e.currentTarget.value)
        .toISOString()
        .split("T")[0];
    } else {
      newState[0][e.currentTarget.id] = e.currentTarget.value;
    }

    setNewInterview(newState);
  }

  async function addNewInterviews(jobId: string) {
    try {
      console.log("adding new interviews");

      const data = await axios.put(
        "http://localhost:5001/interviews/interview",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          interviews: JSON.parse(JSON.stringify(newInterview)),
          job_id: params.jobId as string,
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

      getOneJobInterviews();
      setIsAddInterview(false);
    } catch (error) {
      console.log(error);
    }
  }

  function submitNewInterview() {
    addNewInterviews(params.jobId as string);
  }
  useEffect(() => {
    getOneJobInterviews();
  }, []);

  return (
    <>
      <Divider className="m-10" />
      <div className="pl-36 pr-48">
        <p className="text-2xl" style={{ fontWeight: "bold" }}>
          Interviews
        </p>
        <Button
          onClick={() => {
            setIsAddInterview(true);
          }}
          className="my-2"
          variant="outlined"
        >
          + Add Interview
        </Button>
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
                    <div className="flex justify-between">
                      <p
                        style={{ display: "inline", fontWeight: "bold" }}
                        className="text-xl"
                      >
                        Interview {"#" + interview.stage}
                      </p>
                      <ButtonGroup>
                        <Button
                          onClick={() => handleDeleteInterview(interview)}
                          variant="outlined"
                          startIcon={<DeleteIcon></DeleteIcon>}
                          color="error"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleEditInterview(interview)}
                          variant="outlined"
                          startIcon={<EditIcon fontSize="small" />}
                        >
                          Edit
                        </Button>
                      </ButtonGroup>
                    </div>
                  )}
                  <table
                    style={{ textAlign: "center", width: "50vw" }}
                    className="mx-auto my-8"
                  >
                    <thead>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton animation="wave"></Skeleton>
                          ) : (
                            "Type"
                          )}
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton animation="wave"></Skeleton>
                          ) : (
                            "Date"
                          )}
                        </td>
                        <td style={{ fontWeight: "bold" }}>
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
                  <p style={{ fontWeight: "bold", marginTop: "16px" }}>
                    Interview Notes
                  </p>
                  <div
                    style={{ border: "solid grey 0.5px" }}
                    className="p-3 rounded-lg min-h-[100px]"
                  >
                    {interview.interview_note ? (
                      <p>{interview.interview_note}</p>
                    ) : (
                      <p style={{ color: "lightgrey" }}>No notes yet</p>
                    )}
                  </div>
                  <Divider className="m-10 w-[60vw]" />
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
                    <div className="flex justify-between">
                      <h4
                        style={{ display: "inline", fontWeight: "bold" }}
                        className="text-xl"
                      >
                        Interview {"#" + interview.stage}
                      </h4>
                      <Button
                        onClick={() => handleEdit()}
                        startIcon={<TaskAltIcon fontSize="small" />}
                        variant="outlined"
                      >
                        Save
                      </Button>
                    </div>
                  )}
                  <table
                    style={{ textAlign: "center", width: "50%" }}
                    className="mx-auto"
                  >
                    <thead>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton
                              animation="wave"
                              width="13vw"
                              height={31}
                            ></Skeleton>
                          ) : (
                            "Type"
                          )}
                        </td>

                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton
                              animation="wave"
                              width="10vw"
                              height={31}
                            ></Skeleton>
                          ) : (
                            "Date"
                          )}
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton
                              animation="wave"
                              width="13vw"
                              height={31}
                            ></Skeleton>
                          ) : (
                            "Interviewer Name"
                          )}
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton
                              animation="wave"
                              width="10vw"
                              height={31}
                            ></Skeleton>
                          ) : (
                            "Interviewer Email"
                          )}
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {isLoading ? (
                            <Skeleton
                              animation="wave"
                              width="10vw"
                              height={31}
                            ></Skeleton>
                          ) : (
                            "Interviewer Title"
                          )}
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <td>
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            width="13vw"
                            height={31}
                          ></Skeleton>
                        ) : (
                          <Autocomplete
                            {...interviewDefaultProps}
                            renderInput={(params: any) => (
                              <TextField {...params} variant="standard" />
                            )}
                            defaultValue={interview.type}
                            value={interviewType || interview.type}
                            onChange={(object: any, value: any) => {
                              setInterviewType(value);
                            }}
                            className="w-[13vw]"
                          />
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            width="10vw"
                            height={31}
                          ></Skeleton>
                        ) : (
                          <TextField
                            id="filled-textarea"
                            defaultValue={
                              interview.date &&
                              new Date(
                                new Date(interview.date).getTime() -
                                  new Date(interview.date).getTimezoneOffset() *
                                    60000
                              )
                                .toISOString()
                                .split("T")[0]

                              // interview.date.split("T")[0]
                            }
                            variant="filled"
                            inputProps={{ style: { padding: 8 } }}
                            type="date"
                            inputRef={dateRef}
                            sx={{ width: "10vw", marginLeft: "10px" }}
                          ></TextField>
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            width="10vw"
                            height={31}
                          ></Skeleton>
                        ) : (
                          <TextField
                            id="filled-textarea"
                            defaultValue={interview.interviewer_name}
                            variant="filled"
                            inputProps={{ style: { padding: 8 } }}
                            sx={{ width: "10vw", marginLeft: "10px" }}
                            type="email"
                            inputRef={nameRef}
                          ></TextField>
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            width="10vw"
                            height={31}
                          ></Skeleton>
                        ) : (
                          <TextField
                            id="filled-textarea"
                            defaultValue={interview.interviewer_email}
                            variant="filled"
                            inputProps={{ style: { padding: 8 } }}
                            sx={{ width: "10vw", marginLeft: "10px" }}
                            type="email"
                            inputRef={emailRef}
                          ></TextField>
                        )}
                      </td>
                      <td>
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            width="10vw"
                            height={31}
                          ></Skeleton>
                        ) : (
                          <TextField
                            id="filled-textarea"
                            defaultValue={interview.interviewer_title}
                            variant="filled"
                            inputProps={{ style: { padding: 8 } }}
                            sx={{ width: "10vw", marginLeft: "10px" }}
                            type="email"
                            inputRef={titleRef}
                          ></TextField>
                        )}
                      </td>
                    </tbody>
                  </table>
                  <p style={{ fontWeight: "bold", marginTop: "16px" }}>
                    Interview Notes
                  </p>
                  <TextField
                    id="filled-multiline-static"
                    multiline
                    rows={4}
                    defaultValue={interview.interview_note}
                    variant="filled"
                    inputProps={{ style: { padding: 8 } }}
                    sx={{ width: "75vw" }}
                    inputRef={noteRef}
                  />
                  <Divider className="m-10" />
                </>
              );
            }
          })
        )}
      </div>
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Interview deleted"
        action={action}
      />
      <Dialog
        open={isAddInterview}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAddInterviewClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
      >
        <DialogTitle>Add New Interview</DialogTitle>
        <DialogContent>
          <>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="type"
                sx={{ width: "20%", marginRight: "20px", marginTop: "3px" }}
              >
                Interview Type
              </InputLabel>
              <Autocomplete
                {...interviewDefaultProps}
                renderInput={(params: any) => (
                  <TextField {...params} variant="standard" />
                )}
                id="type"
                // defaultValue={interviews[0].type}
                value={newInterview[0].type}
                onChange={(
                  e: React.SyntheticEvent<Element, Event>,
                  value: any
                ) => {
                  setNewInterview((prevState: interviewType[]) => {
                    const newState = JSON.parse(JSON.stringify(prevState));
                    newState[0].type = value;
                    console.log(newState);
                    return newState;
                  });
                }}
                sx={{ width: "20vw" }}
              />
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="date"
                sx={{ width: "20%", marginRight: "20px", marginTop: "7px" }}
              >
                Interview Date
              </InputLabel>
              <TextField
                id="date"
                // defaultValue={interviews[0].date.split("T")[0]}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                type="date"
                sx={{ width: "20vw" }}
                value={newInterview[0].date}
                onChange={(e) => {
                  handleAddInterviewChange(e);
                }}
              ></TextField>
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="interviewer_name"
                sx={{ width: "20%", marginRight: "20px", marginTop: "6px" }}
              >
                Interviewer Name
              </InputLabel>
              <TextField
                id="interviewer_name"
                // defaultValue={interviews[0].interviewer_name}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "20vw" }}
                value={newInterview[0].interviewer_name}
                onChange={(e) => {
                  handleAddInterviewChange(e);
                }}
              ></TextField>
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="interviewer_email"
                sx={{ width: "20%", marginRight: "20px", marginTop: "6px" }}
              >
                Interviewer Email
              </InputLabel>
              <TextField
                id="interviewer_email"
                // defaultValue={interviews[0].interviewer_email}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "20vw" }}
                type="email"
                value={newInterview[0].interviewer_email}
                onChange={(e) => {
                  handleAddInterviewChange(e);
                }}
              ></TextField>
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="interviewer_title"
                sx={{ width: "20%", marginRight: "20px", marginTop: "6px" }}
              >
                Interviewer Title
              </InputLabel>
              <TextField
                id="interviewer_title"
                // defaultValue={interviews[0].interviewer_title}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "20vw" }}
                value={newInterview[0].interviewer_title}
                onChange={(e) => {
                  handleAddInterviewChange(e);
                }}
              ></TextField>
            </div>

            <p style={{ fontWeight: "bold", marginTop: "16px" }}>
              Interview Notes
            </p>
            <TextField
              id="interview_note"
              multiline
              rows={4}
              // defaultValue={interviews[0].interview_note}
              value={newInterview[0].interview_note}
              onChange={(e) => {
                handleAddInterviewChange(e);
              }}
              variant="filled"
              inputProps={{ style: { padding: 8 } }}
              sx={{ width: "50vw" }}
            />
            <DialogActions>
              <Button
                onClick={() => {
                  setIsAddInterview(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={submitNewInterview} variant="contained">
                Submit
              </Button>
            </DialogActions>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DetailsInterviewView;
