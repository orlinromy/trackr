import { Pool } from "pg";

const pool = new Pool({
  user: "db_user",
  password: "example",
  host: "localhost",
  port: 5432,
  database: "jobapplication",
});

export default pool;
