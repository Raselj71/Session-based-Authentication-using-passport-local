const app = require("./app");
const dbConnect = require("./config/dbconfig");
require("dotenv").config();
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  dbConnect();
  console.log(`your server is running http://localhost:${PORT}`);
});
