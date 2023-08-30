import path from "path"
import * as fs from 'node:fs';
import * as fsPromise from 'node:fs/promises';
const __dirname = path.resolve();

const logger = async (logName: string) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromise.mkdir(path.join(__dirname, "logs"));
    }

    return fs.createWriteStream(path.join(__dirname, "logs", logName), { flags: "a" })
  } catch (error) {
    console.log(error)
  }
}

export default logger;