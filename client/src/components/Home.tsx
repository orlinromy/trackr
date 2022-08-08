import React, { useState } from "react";
import HomeTable from "./HomeTable";
import HomeKanban from "./HomeKanban";
import Button from "@mui/material/Button";
import TocIcon from "@mui/icons-material/Toc";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ButtonGroup from "@mui/material/ButtonGroup";

const Home = () => {
  const [viewMode, setViewMode] = useState<string>(
    localStorage.getItem("viewMode") || "table"
  );
  function setMode(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    console.log(e);
    setViewMode(e.currentTarget.id);
    localStorage.setItem("viewMode", e.currentTarget.id);
  }

  return (
    <div>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
      >
        <Button onClick={setMode} id="table" disabled={viewMode === "table"}>
          <TocIcon />
        </Button>
        <Button onClick={setMode} id="kanban" disabled={viewMode === "kanban"}>
          <ViewKanbanIcon />
        </Button>
      </ButtonGroup>
      {viewMode === "table" ? <HomeTable /> : <HomeKanban />}
    </div>
  );
};

export default Home;
