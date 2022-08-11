import React, { useState } from "react";
import HomeTable from "./HomeTable";
import HomeKanban from "./HomeKanban";
import Button from "@mui/material/Button";
import TocIcon from "@mui/icons-material/Toc";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<string>(
    localStorage.getItem("viewMode") || "table"
  );
  function setMode(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    console.log(e);
    setViewMode(e.currentTarget.id);
    localStorage.setItem("viewMode", e.currentTarget.id);
  }

  function navigateNew() {
    navigate("/new");
  }

  return (
    <>
      <Navbar />
      <div>
        <div>
          <div className="flex justify-between w-[90%] mx-auto">
            <Button
              variant="contained"
              onClick={navigateNew}
              className="bg-sky-600 hover:bg-sky-500"
            >
              {" "}
              + Add New Application
            </Button>
            <ButtonGroup
              variant="outlined"
              aria-label="outlined primary button group"
            >
              <Button
                onClick={setMode}
                id="table"
                disabled={viewMode === "table"}
              >
                <TocIcon />
              </Button>
              <Button
                onClick={setMode}
                id="kanban"
                disabled={viewMode === "kanban"}
              >
                <ViewKanbanIcon />
              </Button>
            </ButtonGroup>
          </div>
          {viewMode === "table" ? <HomeTable /> : <HomeKanban />}
        </div>
      </div>
    </>
  );
};

export default Home;
