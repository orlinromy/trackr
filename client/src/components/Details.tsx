import React, { useState } from "react";
import DetailsView from "./DetailsView";
import DetailsEdit from "./DetailsEdit";
import DetailsInterviewView from "./DetailsInterviewView";
import DetailsInterviewEdit from "./DetailsInterviewEdit";
import Button from "@mui/material/Button";

type detailsProps = {
  isEdit: boolean;
  isInterviewEdit: boolean;
};

const Details = (props: detailsProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  const [isInterviewEdit, setIsInterviewEdit] = useState<boolean>(
    props.isInterviewEdit
  );

  return (
    <div>
      <Button>Edit</Button>
      <div className="job">{isEdit ? <DetailsView /> : <DetailsEdit />}</div>
      <div className="interview">
        {isInterviewEdit ? <DetailsInterviewView /> : <DetailsInterviewEdit />}
      </div>
    </div>
  );
};

export default Details;
