import express, { Router } from "express";
import JobsControllers from "../controllers/jobs";
import auth from "../middleware/auth";

const router = Router();
const JobController = new JobsControllers();

router.post("/job", auth, JobController.getAllJobs);
router.patch("/job", auth, JobController.editJob);
router.patch("/status", auth, JobController.editJobStatus);
router.put("/job", auth, JobController.createNewJob);
// router.patch("/logout", auth, JobController.logout);

export default router;
