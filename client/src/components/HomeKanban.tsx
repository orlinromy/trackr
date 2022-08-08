// import React from "react";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AuthContext from "../context/AuthContext";

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
    latest_status: "APPLIED",
    application_note: "seems not too bad",
    application_date: "2022-04-30T16:00:00.000Z",
    hr_email: "someemail@hr.com",
  },
];

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

const HomeKanban = () => {
  const [columns, setColumns] = useState(statuses);

  return (
    <div style={{ display: "flex", justifyContent: "start", height: "100%" }}>
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
          >
            <h2>{id}</h2>
            <div style={{ margin: 8 }}>
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: 250,
                      minHeight: 500,
                    }}
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
                                    ? "#263b4a"
                                    : "#456C86",
                                  color: "white",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <p>{item.title}</p>
                                <p>{item.company}</p>
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
  );
};

export default HomeKanban;
