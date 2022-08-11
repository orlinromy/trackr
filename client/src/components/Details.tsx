import React, { useState } from "react";
import DetailsView from "./DetailsView";
import DetailsEdit from "./DetailsEdit";
import DetailsInterviewView from "./DetailsInterviewView";
import DetailsInterviewEdit from "./DetailsInterviewEdit";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { jobType, interviewType } from "../types/type";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
// import { useNavigate, useParams } from "react-router-dom";

type detailsProps = {
  isEdit: boolean;
  isInterviewEdit: boolean;
};

const Details = (props: detailsProps) => {
  // const params = useParams<string>();
  const navigate = useNavigate();

  function handleBack() {
    navigate("/");
  }

  return (
    <div>
      <Navbar />
      <div>
        <Button
          className="pl-5"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
        <div className="job">
          {props.isEdit ? <DetailsEdit /> : <DetailsView />}
        </div>
        <div className="interview">
          <DetailsInterviewView />
        </div>
      </div>
    </div>
  );
};

export default Details;
