
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseNextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"), // monorepo root
};

export default baseNextConfig;
