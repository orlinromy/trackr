import React, { useEffect, useState, useContext } from "react";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Slide, { SlideProps } from "@mui/material/Slide";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jobType, interviewType } from "../types/type";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HomeTable = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [jobs, setJobs] = useState<jobType[]>([]);
  const [interviews, setInterviews] = useState<interviewType[]>([]);
  const open = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(event.currentTarget.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId("");
  };

  function handleDeleteClose() {
    setIsDeleteClicked(false);
    handleMenuClose();
  }

  async function getAllJobs() {
    console.log("get all jobs");
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
      console.log(data.data);

      if (data.data.access) {
        authCtx.setCredentials({
          ...authCtx.credentials,
          access: data.data.access,
        });
        localStorage.setItem("access", data.data.access);
      }
      setJobs(data.data.jobs);
      // await getAllInterviews();
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  async function getAllInterviews() {
    console.log("get all interviews");

    try {
      const data = await axios.post(
        "http://localhost:5001/interviews/interview",
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
      console.log(data);
      if (data.data.access) {
        authCtx.setCredentials({
          ...authCtx.credentials,
          access: data.data.access,
        });
        localStorage.setItem("access", data.data.access);
      }
      setInterviews(data.data.interviews);
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  function handleDetails() {
    handleMenuClose();
    navigate(`/detail/${selectedId}`);
    // console.log(e);
  }

  function handleDelete() {
    setIsDeleteClicked(true);
    setAnchorEl(null);
  }

  async function deleteEntry() {
    console.log("delete", selectedId);
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
      console.log(data.data);
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

  useEffect(() => {
    getAllJobs();
    getAllInterviews();
  }, []);

  function setInterviewDate(jobId: string) {
    const jobInterview = interviews.filter((interview) => {
      // console.log(new Date(Date.now()) < new Date(interview.date));
      return (
        interview.job_id === jobId &&
        new Date(Date.now()) < new Date(interview.date)
      );
    });

    // console.log(jobInterview[0]);
    return jobInterview[0];
  }

  function setInterviewDetail(jobId: string) {
    const upcomingInterview = setInterviewDate(jobId);

    let interviewer = "";
    if (
      !upcomingInterview.interviewer_name &&
      !upcomingInterview.interviewer_title
    ) {
      interviewer = "";
    } else if (!upcomingInterview.interviewer_name) {
      interviewer = `Interviewer: ${upcomingInterview.interviewer_title}`;
    } else if (!upcomingInterview.interviewer_title) {
      interviewer = `Interviewer: ${upcomingInterview.interviewer_name}`;
    } else {
      interviewer = `Interviewer: ${upcomingInterview.interviewer_name} (${upcomingInterview.interviewer_title})`;
    }
    return `stage: ${upcomingInterview.stage}\ntype: ${upcomingInterview.type}\n${interviewer}`;
  }

  return (
    <div>
      <Button variant="contained"> + Add New Application</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Apply Date</TableCell>
            <TableCell>Upcoming Interview</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.length === 0 && (
            <TableCell colSpan={7}>Nothing is here yet...</TableCell>
          )}
          {jobs.map((data, index) => (
            <TableRow id={data.id} key={index}>
              <TableCell>{data.title}</TableCell>
              <TableCell>{data.company}</TableCell>
              <TableCell>{data.location}</TableCell>
              <TableCell>
                <Chip label={data.latest_status} />
              </TableCell>
              <TableCell>
                {new Date(data.application_date)
                  .toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, " ")}
              </TableCell>
              <TableCell>
                {setInterviewDate(data.id) ? (
                  <Tooltip
                    disableFocusListener
                    placement="bottom"
                    title={
                      <span style={{ whiteSpace: "pre-line" }}>
                        {setInterviewDetail(data.id)}
                      </span>
                    }
                    arrow
                  >
                    <span>
                      {new Date(
                        setInterviewDate(data.id).date
                      ).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip
                    disableFocusListener
                    placement="bottom"
                    title="Add an interview"
                    arrow
                  >
                    <a href="#">
                      <span style={{ color: "lightgrey" }}>
                        No interview set
                      </span>
                    </a>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <Button
                  id={data.id}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={openMenu}
                >
                  <MoreVertIcon />
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  PaperProps={{
                    style: {
                      width: `150px`,
                    },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  elevation={1}
                >
                  <MenuList dense>
                    <MenuItem id={data.id} onClick={handleDetails}>
                      <ListItemText>Details</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem id={data.id} onClick={handleDelete}>
                      <ListItemText sx={{ color: "red" }}>Delete</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  );
};

export default HomeTable;
