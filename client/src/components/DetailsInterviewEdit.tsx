import React, { useContext, useEffect, useState } from "react";
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

const DetailsInterviewEdit = () => {
  // const navigate = useNavigate();
  // const authCtx = useContext(AuthContext);
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
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const params = useParams();

  // async function getOneJobInterviews() {
  //   setIsLoading(true);
  //   console.log("get all interviews");
  //   try {
  //     const data = await axios.post(
  //       "http://localhost:5001/interviews/oneInterview",
  //       {
  //         refreshToken:
  //           authCtx.credentials.refresh || localStorage.getItem("refresh"),
  //         job_id: params.jobId,
  //       },
  //       {
  //         headers: {
  //           //@ts-ignore
  //           Authorization:
  //             authCtx.credentials.access || localStorage.getItem("access"),
  //         },
  //       }
  //     );
  //     console.log(data.data);

  //     if (data.data.access) {
  //       authCtx.setCredentials({
  //         ...authCtx.credentials,
  //         access: data.data.access,
  //       });
  //       localStorage.setItem("access", data.data.access);
  //     }
  //     setInterviews(data.data.interview);
  //     // await getAllInterviews();
  //     setTimeout(() => setIsLoading(false), 1500);
  //   } catch (error: any) {
  //     console.log(error);
  //     if (error.response.data.message === "log in required") {
  //       navigate("/login");
  //     }
  //   }
  // }

  // function displayInterviewer(
  //   name: string | null,
  //   email: string | null,
  //   title: string | null
  // ) {
  //   if (!name && !email && !title) {
  //     return <p style={{ color: "lightgrey" }}>N/A</p>;
  //   } else if (email) {
  //     if (!name && !title) {
  //       return <a href={`mailto:${email}`}>{email}</a>;
  //     } else if (!name) {
  //       return <a href={`mailto:${email}`}>{title}</a>;
  //     } else if (!title) {
  //       return <a href={`mailto:${email}`}>{name}</a>;
  //     } else {
  //       return (
  //         <a href={`mailto:${email}`}>
  //           {name} ({title})
  //         </a>
  //       );
  //     }
  //   } else {
  //     if (!name) {
  //       return <p>{title}</p>;
  //     } else if (!title) {
  //       return <p>{name}</p>;
  //     } else {
  //       return (
  //         <p>
  //           {name} ({title})
  //         </p>
  //       );
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getOneJobInterviews();
  // }, []);

  // return (
  //   <div>
  //     <Button>Edit</Button>
  //     <h3>Interviews</h3>

  //     {!isLoading && interviews.length === 0 ? (
  //       <p style={{ color: "lightgrey" }}>No interviews set</p>
  //     ) : (
  //       interviews.map((interview) => (
  //         <>
  //           {isLoading ? (
  //             <h3>
  //               <Skeleton animation="wave" width="15%"></Skeleton>
  //             </h3>
  //           ) : (
  //             <span>
  //               <h4 style={{ display: "inline" }}>
  //                 Interview {"#" + interview.stage}
  //               </h4>
  //             </span>
  //           )}
  //           <table style={{ textAlign: "center", width: "50%" }}>
  //             <thead>
  //               <tr>
  //                 <td>
  //                   {isLoading ? (
  //                     <Skeleton animation="wave"></Skeleton>
  //                   ) : (
  //                     "Type"
  //                   )}
  //                 </td>
  //                 <td>
  //                   {isLoading ? (
  //                     <Skeleton animation="wave"></Skeleton>
  //                   ) : (
  //                     "Date"
  //                   )}
  //                 </td>
  //                 <td>
  //                   {isLoading ? (
  //                     <Skeleton animation="wave"></Skeleton>
  //                   ) : (
  //                     "Interviewer"
  //                   )}
  //                 </td>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <td>
  //                 {isLoading ? (
  //                   <Skeleton animation="wave"></Skeleton>
  //                 ) : (
  //                   interview.type
  //                 )}
  //               </td>
  //               <td>
  //                 {isLoading ? (
  //                   <Skeleton animation="wave"></Skeleton>
  //                 ) : (
  //                   new Date(interview.date)
  //                     .toLocaleDateString("en-GB", {
  //                       weekday: "long",
  //                       day: "numeric",
  //                       month: "short",
  //                       year: "numeric",
  //                     })
  //                     .replace(/ /g, " ")
  //                 )}
  //               </td>
  //               <td>
  //                 {isLoading ? (
  //                   <Skeleton animation="wave"></Skeleton>
  //                 ) : (
  //                   displayInterviewer(
  //                     interview.interviewer_name,
  //                     interview.interviewer_email,
  //                     interview.interviewer_title
  //                   )
  //                 )}
  //               </td>
  //             </tbody>
  //           </table>
  //           <p style={{ fontWeight: "bold" }}>Interview notes</p>
  //           <div style={{ border: "solid grey 0.5px", width: "70%" }}>
  //             {interview.interview_note ? (
  //               <p>interview.interview_note</p>
  //             ) : (
  //               <p style={{ color: "lightgrey" }}>No notes yet</p>
  //             )}
  //           </div>
  //         </>
  //       ))
  //     )}
  //   </div>
  // );
  return <div></div>;
};

export default DetailsInterviewEdit;
