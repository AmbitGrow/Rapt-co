// Hostinger loads this entry point through its own Node.js app runner.
// Call listen() unconditionally: an import/loader path may not set argv[1]
// to this source file, and Hostinger requires a listener within 3 seconds.
import app from "./app.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log("[rapt-hostinger] Listening on port", port);
});
