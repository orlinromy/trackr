import React, { useState } from "react";
import DetailsView from "./DetailsView";
import DetailsEdit from "./DetailsEdit";
import DetailsInterviewView from "./DetailsInterviewView";
import DetailsInterviewEdit from "./DetailsInterviewEdit";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { jobType, interviewType } from "../types/type";
import { useNavigate, useParams } from "react-router-dom";

type detailsProps = {
  isEdit: boolean;
  isInterviewEdit: boolean;
};

const Details = (props: detailsProps) => {
  // const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  // const [isInterviewEdit, setIsInterviewEdit] = useState<boolean>(
  //   props.isInterviewEdit
  // );
  const params = useParams<string>();
  const navigate = useNavigate();

  // const [job, setJob] = useState<jobType>({
  //   id: "",
  //   title: "",
  //   company: "",
  //   location: "",
  //   jd_link: null,
  //   jd_file: null,
  //   latest_status: "",
  //   application_note: "",
  //   application_date: "",
  //   hr_email: null,
  // });

  // const [interviews, setInterviews] = useState<interviewType[]>([
  //   {
  //     id: "",
  //     stage: 0,
  //     type: "",
  //     date: "",
  //     has_assignment: false,
  //     assignment_details: null,
  //     interview_note: null,
  //     job_id: "",
  //     interviewer_name: null,
  //     interviewer_email: null,
  //     interviewer_title: null,
  //   },
  // ]);

  function handleBack() {
    navigate("/");
  }

  return (
    <div>
      <Button onClick={handleBack}>
        <ArrowBackIcon></ArrowBackIcon>
      </Button>
      <div className="job">
        {props.isEdit ? <DetailsEdit /> : <DetailsView />}
      </div>
      <div className="interview">
        <DetailsInterviewView />
      </div>
    </div>
  );
};

export default Details;
