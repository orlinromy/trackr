import jwt from "jsonwebtoken";
import { get, omit } from "lodash";
import pool from "../db/db";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

async function isSessionValid(sessionId: string | undefined) {
  const client = await pool.connect();
  const getSessionSql: string = "SELECT * from sessions where id = $1::uuid";
  const { rows: session } = await client.query(getSessionSql, [sessionId]);
  client.release();
  return session.length === 0 || !session[0].valid;
}

async function decode(token: string, type: string) {
  try {
    const decoded = jwt.verify(
      token,
      type === "refresh"
        ? (process.env.REFRESH_SECRET as string)
        : (process.env.ACCESS_SECRET as string)
    );

    const isNotValid = await isSessionValid(get(decoded, "sessionId"));

    return isNotValid
      ? { valid: false, expired: true, decoded: null }
      : { valid: true, expired: false, decoded };
  } catch (e) {
    return {
      valid: false,
      expired: get(e, "message") === "jwt expired",
      decoded: null,
    };
  }
}

async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  // Decode the refresh token
  const { decoded } = await decode(refreshToken, "refresh");

  if (!decoded || !get(decoded, "sessionId")) return false;

  const client = await pool.connect();

  const isNotValid = await isSessionValid(get(decoded, "sessionId"));

  if (isNotValid) return false;

  const getUserSql: string = "SELECT * from users where id = $1::uuid";
  const { rows: user } = await client.query(getUserSql, [
    get(decoded, "userId"),
  ]);

  if (user.length === 0) return false;

  const accessToken = jwt.sign(
    omit(decoded as object, ["jti", "exp", "iat"]),
    process.env.ACCESS_SECRET as string,
    { expiresIn: "30s", jwtid: uuidv4() } // 15 minutes
  );

  return accessToken;
}

async function isAuthJob(userId: string, jobId: string) {
  console.log("userId: ", userId);
  console.log("jobId: ", jobId);
  const client = await pool.connect();
  const checkJobSql: string =
    "SELECT * FROM applications WHERE user_id = $1 and id = $2;";
  const { rows: checkJob } = await client.query(checkJobSql, [userId, jobId]);

  console.log(checkJob);
  client.release();
  return checkJob.length !== 0;
}

async function isAuthInterview(
  userId: string,
  jobId: string,
  interviewId: string
) {
  console.log("userId: ", userId);
  console.log("jobId: ", jobId);
  console.log("interviewId: ", interviewId);
  const client = await pool.connect();
  const checkJobSql: string =
    "SELECT * FROM applications LEFT JOIN interviews ON applications.id = interviews.job_id WHERE user_id = $1 and interviews.job_id = $2 and interviews.id = $3;";
  const { rows: checkJob } = await client.query(checkJobSql, [
    userId,
    jobId,
    interviewId,
  ]);
  console.log(checkJob);
  client.release();
  return checkJob.length !== 0;
}

export { decode, reIssueAccessToken, isAuthJob, isAuthInterview };
