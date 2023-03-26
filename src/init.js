import "dotenv/config";
import "./db"; //connect to mongo
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const port = process.env.PORT || "8080";

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(port, handleListening);
