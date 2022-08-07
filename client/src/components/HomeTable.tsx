import React, { useEffect, useState } from "react";
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
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

const HomeTable = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );
  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function getAllJobs() {}

  function getAllInterviews() {}

  useEffect(() => {
    getAllJobs();
    getAllInterviews();
  }, []);

  const jobs = [
    {
      id: "e18bf630-0e37-4143-bb18-7700130fc050",
      title: "Front-end Engineer",
      company: "SHIELD",
      location: "Singapore",
      jd_link: null,
      jd_file: null,
      latest_status: "APPLIED",
      application_note: "",
      application_date: "2022-08-05T16:00:00.000Z",
      hr_email: null,
    },
    {
      id: "21673a94-3025-4d11-8e49-8442a91f3d57",
      title: "some title",
      company: "DBS",
      location: "Singapore",
      jd_link: null,
      jd_file: null,
      latest_status: "PENDING_REPLY",
      application_note: "seems not too bad",
      application_date: "2022-04-30T16:00:00.000Z",
      hr_email: "someemail@hr.com",
    },
  ];

  const interviews = [
    {
      id: "8460734c-7a78-4026-81c7-cac0f9148002",
      stage: 1,
      type: "PHONE",
      date: "2022-08-08T16:00:00.000Z",
      has_assignment: false,
      assignment_details: null,
      interview_note: null,
      job_id: "21673a94-3025-4d11-8e49-8442a91f3d57",
      interviewer_name: null,
      interviewer_email: null,
      interviewer_title: null,
    },
    {
      id: "6aa72b6c-e466-4d78-9e23-74ffa08d5067",
      stage: 2,
      type: "TECHNICAL",
      date: "2022-08-09T16:00:00.000Z",
      has_assignment: false,
      assignment_details: null,
      interview_note: null,
      job_id: "21673a94-3025-4d11-8e49-8442a91f3d57",
      interviewer_name: null,
      interviewer_email: null,
      interviewer_title: null,
    },
  ];

  function setInterviewDate(jobId: string) {
    const jobInterview = interviews.filter((interview) => {
      console.log(new Date(Date.now()) < new Date(interview.date));
      return (
        interview.job_id === jobId &&
        new Date(Date.now()) < new Date(interview.date)
      );
    });

    console.log(jobInterview[0]);
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

  const dateOption = { year: "numeric", month: "short", day: "numeric" };

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
          {jobs.map((data) => (
            <TableRow id={data.id}>
              <TableCell>{data.title}</TableCell>
              <TableCell>{data.company}</TableCell>
              <TableCell>{data.location}</TableCell>
              <TableCell>
                <Chip label={data.latest_status} />
              </TableCell>
              <TableCell>
                {new Date(data.application_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {setInterviewDate(data.id) ? (
                  <Tooltip
                    disableFocusListener
                    title={
                      <span style={{ whiteSpace: "pre-line" }}>
                        {setInterviewDetail(data.id)}
                      </span>
                    }
                    arrow
                  >
                    <p>{setInterviewDate(data.id).date}</p>
                  </Tooltip>
                ) : (
                  "No interview set"
                )}
              </TableCell>
              <TableCell>
                <Button
                  id="basic-button"
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
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleClose}>Details</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <p style={{ color: "red" }}>Delete</p>
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HomeTable;
