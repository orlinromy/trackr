// import React from "react";
import React, { useContext, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import AuthContext from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import { jobType, interviewType } from "../types/type";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import Slide, { SlideProps } from "@mui/material/Slide";
import InputLabel from "@mui/material/InputLabel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HomeKanban = () => {
  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();
  const [jobs, setJobs] = useState<jobType[]>([]);
  const [columns, setColumns] = useState({});
  const [isAddInterview, setIsAddInterview] = useState<boolean>(false);
  const [interviewJobId, setInterviewJobId] = useState<string>("");
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const [isUpdateApplyDate, setIsUpdateApplydate] = useState<boolean>(false);
  const [jobUpdateDate, setJobUpdateDate] = useState<jobType>();

  function handleUpdateApplyClose() {
    setIsUpdateApplydate(false);
    setJobUpdateDate(undefined);
  }

  async function updateApplyDate() {
    try {
      // (jobUpdateDate as jobType).application_date = new Date(Date.now()).toISOString().split("T")[0];

      const data = await axios.patch(
        "http://localhost:5001/jobs/job",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          jobId: (jobUpdateDate as jobType).id,
          title: (jobUpdateDate as jobType).title,
          company: (jobUpdateDate as jobType).company,
          location: (jobUpdateDate as jobType).location,
          jd_link: (jobUpdateDate as jobType).jd_link,
          jd_file: (jobUpdateDate as jobType).jd_file,
          latest_status: "APPLIED",
          application_date: new Date(Date.now()).toISOString().split("T")[0],
          hr_email: (jobUpdateDate as jobType).hr_email,
          application_note: (jobUpdateDate as jobType).application_note,
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
      handleUpdateApplyClose();
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function handleDelete(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    jobId: string
  ) {
    setIsDeleteClicked(true);
    setSelectedId(jobId);
  }

  async function deleteEntry() {
    try {
      const data = await axios.delete("http://localhost:5001/jobs/job", {
        headers: {
          //@ts-ignore
          Authorization:
            authCtx.credentials.access || localStorage.getItem("access"),
        },
        data: {
          jobId: selectedId,
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
        },
      });
      if (data.data.access) {
        authCtx.setCredentials({
          ...authCtx.credentials,
          access: data.data.access,
        });
        localStorage.setItem("access", data.data.access);
      }
      setSelectedId("");
      setIsDeleteClicked(false);
      getAllJobs();
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function handleDeleteClose() {
    setIsDeleteClicked(false);
  }
  const [interviews, setInterviews] = useState<interviewType[]>([
    {
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
    },
  ]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newState = JSON.parse(JSON.stringify(interviews));
    if (e.currentTarget.id === "date") {
      newState[0][e.currentTarget.id] = new Date(e.currentTarget.value)
        .toISOString()
        .split("T")[0];
    } else {
      newState[0][e.currentTarget.id] = e.currentTarget.value;
    }

    setInterviews(newState);
  }

  async function addNewInterviews(jobId: string) {
    try {
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

  async function getAllJobs() {
    try {
      const data = await axios.post(
        "http://localhost:5001/jobs/job",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
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
      setJobs(data.data.jobs);
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function submitNewInterview() {
    addNewInterviews(interviewJobId);
  }

  function addANewInterview(movedItem: jobType) {
    setIsAddInterview(true);
    setInterviewJobId(movedItem.id);
  }

  function handleModalClose() {
    setIsAddInterview(false);
    setInterviewJobId("");
  }

  async function updateStatus(job: jobType, newStatus: string) {
    try {
      const data = await axios.patch(
        "http://localhost:5001/jobs/status",
        {
          refreshToken:
            authCtx.credentials.refresh || localStorage.getItem("refresh"),
          latest_status: newStatus,
          jobId: job.id,
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
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  const onDragEnd = (result: DropResult, columns: any, setColumns: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      updateStatus(removed, destination.droppableId);

      if (destination.droppableId === "INTERVIEW") {
        addANewInterview(removed);
      } else if (
        source.droppableId === "WISHLIST" &&
        destination.droppableId === "APPLIED"
      ) {
        setIsUpdateApplydate(true);
        setJobUpdateDate(removed);
      }
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  useEffect(() => {
    const statuses = {
      WISHLIST: {
        items: jobs.filter((job) => job.latest_status === "WISHLIST"),
      },
      APPLIED: {
        items: jobs.filter((job) => job.latest_status === "APPLIED"),
      },
      PENDING_REPLY: {
        items: jobs.filter((job) => job.latest_status === "PENDING_REPLY"),
      },
      INTERVIEW: {
        items: jobs.filter((job) => job.latest_status === "INTERVIEW"),
      },
      OFFER_DECLINED: {
        items: jobs.filter((job) => job.latest_status === "OFFER_DECLINED"),
      },
      OFFER_ACCEPTED: {
        items: jobs.filter((job) => job.latest_status === "OFFER_ACCEPTED"),
      },
      WITHDRAWN: {
        items: jobs.filter((job) => job.latest_status === "WITHDRAWN"),
      },
      REJECTED: {
        items: jobs.filter((job) => job.latest_status === "REJECTED"),
      },
    };
    setColumns(statuses);
  }, [jobs]);

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          margin: "10px auto",
          height: "100%",
          width: "99vw",
          overflow: "scroll",
        }}
      >
        <DragDropContext
          onDragEnd={(result: DropResult) =>
            onDragEnd(result, columns, setColumns)
          }
        >
          {Object.entries(columns).map(([id, column]) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              className="border border-stone-300 mx-2 bg-stone-200"
            >
              <p className="text-lg my-4 tracking-wide font-bold">{id}</p>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "#fafaf9",
                        padding: 4,
                        width: 250,
                        // minHeight: 500,
                        height: "80vh",
                        overflow: "scroll",
                      }}
                      className="border border-stone-200"
                    >
                      {/* @ts-ignore */}
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: "none",
                                    padding: 16,
                                    margin: "0 0 8px 0",
                                    minHeight: "50px",
                                    backgroundColor: snapshot.isDragging
                                      ? "#0369a1"
                                      : "#0d9488",
                                    color: "white",
                                    ...provided.draggableProps.style,
                                  }}
                                  onDoubleClick={() => {
                                    navigate(`/detail/${item.id}`);
                                  }}
                                >
                                  <p>{item.title}</p>
                                  <p>
                                    <BusinessIcon></BusinessIcon>
                                    {item.company}
                                  </p>
                                  <p
                                    style={{
                                      textAlign: "right",
                                      margin: 0,
                                      padding: 0,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        handleDelete(e, item.id);
                                      }}
                                    >
                                      <DeleteIcon sx={{ color: "lightgrey" }} />
                                    </IconButton>
                                  </p>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>

      <Dialog
        open={isAddInterview}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleModalClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xl"
      >
        <DialogTitle>Add New Interview</DialogTitle>
        <DialogContent>
          <>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="type"
                sx={{ width: "30%", marginRight: "20px" }}
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
                value={interviews[0].type}
                onChange={(
                  e: React.SyntheticEvent<Element, Event>,
                  value: any
                ) => {
                  setInterviews((prevState: interviewType[]) => {
                    const newState = JSON.parse(JSON.stringify(prevState));
                    newState[0].type = value;
                    return newState;
                  });
                }}
                sx={{ width: "20vw" }}
              />
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="date"
                sx={{ width: "30%", marginRight: "20px" }}
              >
                Date
              </InputLabel>
              <TextField
                id="date"
                // defaultValue={interviews[0].date.split("T")[0]}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                type="date"
                sx={{ width: "20vw" }}
                value={interviews[0].date}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></TextField>
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="interviewer_name"
                sx={{ width: "30%", marginRight: "20px" }}
              >
                Interviewer Name
              </InputLabel>
              <TextField
                id="interviewer_name"
                // defaultValue={interviews[0].interviewer_name}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "20vw" }}
                value={interviews[0].interviewer_name}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></TextField>
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="interviewer_email"
                sx={{ width: "30%", marginRight: "20px" }}
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
                value={interviews[0].interviewer_email}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></TextField>
            </div>
            <div style={{ display: "flex" }}>
              <InputLabel
                htmlFor="interviewer_title"
                sx={{ width: "30%", marginRight: "20px" }}
              >
                Interviewer Title
              </InputLabel>
              <TextField
                id="interviewer_title"
                // defaultValue={interviews[0].interviewer_title}
                variant="filled"
                inputProps={{ style: { padding: 8 } }}
                sx={{ width: "20vw" }}
                value={interviews[0].interviewer_title}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></TextField>
            </div>

            <p style={{ fontWeight: "bold" }}>Interview notes</p>
            <TextField
              id="interview_note"
              multiline
              rows={4}
              // defaultValue={interviews[0].interview_note}
              value={interviews[0].interview_note}
              onChange={(e) => {
                handleChange(e);
              }}
              variant="filled"
              inputProps={{ style: { padding: 8 } }}
              sx={{ width: "80vw" }}
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
      <Dialog
        open={isDeleteClicked}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteClose}>No</Button>
          <Button onClick={deleteEntry}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isUpdateApplyDate}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleUpdateApplyClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          Would you like to use today's date as application date?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleUpdateApplyClose}>No</Button>
          <Button onClick={updateApplyDate}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HomeKanban;
