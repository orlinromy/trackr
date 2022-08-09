import React, { useState } from "react";
import DetailsView from "./DetailsView";
import DetailsEdit from "./DetailsEdit";
import DetailsInterviewView from "./DetailsInterviewView";
import DetailsInterviewEdit from "./DetailsInterviewEdit";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { jobType } from "../types/type";
import { useNavigate, useParams } from "react-router-dom";

type detailsProps = {
  isEdit: boolean;
  isInterviewEdit: boolean;
};

const Details = (props: detailsProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  const [isInterviewEdit, setIsInterviewEdit] = useState<boolean>(
    props.isInterviewEdit
  );
  const params = useParams<string>();
  const navigate = useNavigate();

  function handleBack() {
    navigate("/");
  }

  return (
    <div>
      <Button onClick={handleBack}>
        <ArrowBackIcon></ArrowBackIcon>
      </Button>
      <div className="job">{isEdit ? <DetailsEdit /> : <DetailsView />}</div>
      <div className="interview">
        {isInterviewEdit ? <DetailsInterviewEdit /> : <DetailsInterviewView />}
      </div>
    </div>
  );
};

export default Details;
