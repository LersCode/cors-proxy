import { getTimestamp } from "../functions/timestamp.js";

function logging(enabled, string, status = "INFO") {
  if (enabled) {
    console.log(`<${getTimestamp()}>[${status}] ${string}`);
  }
}
