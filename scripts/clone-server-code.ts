import { join as joinPath } from "path";
import { execSync } from "child_process";
import dotenv from "dotenv";

const ROOT_PATH = joinPath(__dirname, "..");

const ENV_PATH = joinPath(ROOT_PATH, ".env.local");

dotenv.config({ path: ENV_PATH });

// const CODE_LOCATION_FOR_SERVER = joinPath(ROOT_PATH, "server-code");

const { SERVER_REMOTE_URL } = process.env;
if (!SERVER_REMOTE_URL) throw new Error("Must provide server clone path");

execSync(`git clone ${SERVER_REMOTE_URL} server-code`, {
  stdio: [0, 1, 2],
  cwd: ROOT_PATH,
});
