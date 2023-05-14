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
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jobType, interviewType } from "../types/type";
import { Box, IconButton } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

type Data = "application_date" | "upcomingInterview";
type Order = "asc" | "desc";
type Filter =
  | "APPLIED"
  | "WISHLIST"
  | "PENDING_REPLY"
  | "INTERVIEW"
  | "OFFER_DECLINED"
  | "OFFER_ACCEPTED"
  | "WITHDRAWN"
  | "REJECTED"
  | "";

const HomeTable = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [jobs, setJobs] = useState<(jobType & { upcomingInterview: string })[]>(
    []
  );
  const [interviews, setInterviews] = useState<interviewType[]>([]);
  const open = Boolean(anchorEl);
  const [orderBy, setOrderBy] = React.useState<Data>("upcomingInterview");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [filter, setFilter] = React.useState<Filter>("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<
    (EventTarget & HTMLElement) | null
  >(null);
  const filterOpen = Boolean(filterAnchorEl);

  const createSortHandler =
    (property: Data) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(event.currentTarget.id);
  };

  const openFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId("");
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  function handleDeleteClose() {
    setIsDeleteClicked(false);
    handleMenuClose();
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
      // await getAllInterviews();
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "log in required") {
        navigate("/login");
      }
    }
  }

  async function getAllInterviews() {
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
  }

  function handleDelete() {
    setIsDeleteClicked(true);
    setAnchorEl(null);
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

  useEffect(() => {
    getAllJobs();
    getAllInterviews();
  }, []);

  function setInterviewDate(jobId: string) {
    const jobInterview = interviews.filter((interview) => {
      return (
        interview.job_id === jobId &&
        new Date(Date.now()) < new Date(interview.date)
      );
    });

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

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy] || a[orderBy] === null) {
      return -1;
    }
    if (b[orderBy] > a[orderBy] || b[orderBy] === null) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  return (
    <div>
      <div className="w-[95%] h-[80vh] overflow-scroll border rounded-xl shadow-2xl mx-auto my-10">
        <div className="w-[95%] mx-auto py-2">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className="text-lg">Job Title</TableCell>
                <TableCell className="text-lg">Company</TableCell>
                <TableCell className="text-lg">Location</TableCell>
                <TableCell className="text-lg">
                  Status
                  <IconButton onClick={openFilterMenu}>
                    <FilterAltIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={filterAnchorEl}
                    open={filterOpen}
                    onClose={handleFilterMenuClose}
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
                      <MenuItem
                        onClick={() => {
                          setFilter("");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>None</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("WISHLIST");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>WISHLIST</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("APPLIED");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>APPLIED</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("PENDING_REPLY");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>PENDING_REPLY</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("INTERVIEW");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>INTERVIEW</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("OFFER_ACCEPTED");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>OFFER_ACCEPTED</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("OFFER_DECLINED");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>OFFER_DECLINED</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("WITHDRAWN");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>WITHDRAWN</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilter("REJECTED");
                          handleFilterMenuClose();
                        }}
                      >
                        <ListItemText>REJECTED</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </TableCell>
                <TableCell className="text-lg">
                  <TableSortLabel
                    active={orderBy === "application_date"}
                    direction={orderBy === "application_date" ? order : "asc"}
                    onClick={createSortHandler("application_date")}
                  >
                    Apply Date
                    {orderBy === "application_date" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-lg">
                  <TableSortLabel
                    active={orderBy === "upcomingInterview"}
                    direction={orderBy === "upcomingInterview" ? order : "asc"}
                    onClick={createSortHandler("upcomingInterview")}
                  >
                    Upcoming Interview
                    {orderBy === "upcomingInterview" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}{" "}
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-lg"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length === 0 && (
                <TableCell colSpan={7}>Nothing is here yet...</TableCell>
              )}
              {jobs
                .filter((data) =>
                  filter === "" ? data : data.latest_status === filter
                )
                .map((data) => {
                  data.upcomingInterview =
                    setInterviewDate(data.id)?.date ||
                    new Date(Date.now() + 473385600000).toISOString();
                  return data;
                })
                .sort(getComparator(order, orderBy))
                .map((data, index) => {
                  return (
                    <TableRow id={data.id} key={index}>
                      <TableCell>{data.title}</TableCell>
                      <TableCell>{data.company}</TableCell>
                      <TableCell>{data.location}</TableCell>
                      <TableCell>
                        <Chip label={data.latest_status} />
                      </TableCell>
                      <TableCell>
                        {data.application_date ? (
                          new Date(data.application_date)
                            .toLocaleDateString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(/ /g, " ")
                        ) : (
                          <p style={{ display: "inline", color: "lightgray" }}>
                            Not applied yet
                          </p>
                        )}
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
                              <ListItemText sx={{ color: "red" }}>
                                Delete
                              </ListItemText>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog
        open={isDeleteClicked}
        keepMounted
        onClose={handleDeleteClose}
        aria-describedby="alert-dialog-slide-description"
        className="backdrop-blur-sm"
        componentsProps={{
          backdrop: { style: { backgroundColor: "rgba(0,0,0,0.15)" } },
        }}
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
