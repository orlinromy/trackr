import pool from "../db/db";
import { Request, Response } from "express";
// import * as bcrypt from "bcrypt";
// import * as jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";
import { isAuthJob, isAuthInterview } from "../utils/utils";
import { get } from "lodash";
import * as dotenv from "dotenv";
import { PoolClient } from "pg";
dotenv.config();

class InterviewsController {
  public async addInterview(req: Request, res: Response) {
    // id
    // stage
    // type
    // date
    // has_assignment
    // assignment_details
    // interview_note
    // job_id
    try {
      const isUsersJob = await isAuthJob(
        get(req, "decoded.userId"),
        req.body.job_id
      );
      if (!isUsersJob)
        return res.status(401).json({ message: "addInterview not authorized" });

      const client: PoolClient = await pool.connect();
      const jobInterviewSql: string =
        "SELECT max(stage) as last_stage from interviews WHERE job_id = $1 GROUP BY job_id;";

      const { rows: maxInterviewStage } = await client.query(jobInterviewSql, [
        req.body.job_id,
      ]);

      const currInterviewStage: number =
        parseInt(maxInterviewStage[0].last_stage) + 1 || 1;

      const newInterviewSql: string =
        "INSERT INTO interviews(stage, type, date, has_assignment, assignment_details, interview_note, job_id) VALUES ($1, $2, DATE($3), $4, $5, $6, $7) RETURNING *;";

      const { rows: newInterview } = await client.query(newInterviewSql, [
        req.body.stage || currInterviewStage,
        req.body.type,
        req.body.date || new Date(),
        req.body.has_assignment || false,
        req.body.assignment_details || null,
        req.body.interview_note || null,
        req.body.job_id,
      ]);
      client.release();
      const access = res.getHeader("x-access-token");
      res.status(200).json({ newInterview, access });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  public async editInterview(req: Request, res: Response) {
    try {
      const isUsersInterview = await isAuthInterview(
        get(req, "decoded.userId"),
        req.body.job_id,
        req.body.interview_id
      );
      if (!isUsersInterview)
        return res
          .status(401)
          .json({ message: "editInterview not authorized" });

      const client: PoolClient = await pool.connect();

      const editInterviewSql: string =
        "UPDATE interviews SET stage = $1, type = $2, date = $3, has_assignment = $4, assignment_details = $5, interview_note = $6 WHERE id = $7 RETURNING *;";

      const { rows: interview } = await client.query(editInterviewSql, [
        req.body.stage,
        req.body.type,
        req.body.date,
        req.body.has_assignment,
        req.body.assignment_details,
        req.body.interview_note,
        req.body.interview_id,
      ]);
      client.release();
      const access = res.getHeader("x-access-token");
      res.status(200).json({ interview, access });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  public async deleteInterview(req: Request, res: Response) {
    try {
      // deleting the interview shouldn't affect anything
      const isUsersInterview = await isAuthInterview(
        get(req, "decoded.userId"),
        req.body.job_id,
        req.body.interview_id
      );
      if (!isUsersInterview)
        return res
          .status(401)
          .json({ message: "deleteInterview not authorized" });
      const client: PoolClient = await pool.connect();

      const deleteInterviewSql: string =
        "DELETE from interviews WHERE id = $1 RETURNING *;";

      const { rows: deletedInterview } = await client.query(
        deleteInterviewSql,
        [req.body.interview_id]
      );

      const access = res.getHeader("x-access-token");
      res.status(200).json({ deletedInterview, access });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

export default InterviewsController;
