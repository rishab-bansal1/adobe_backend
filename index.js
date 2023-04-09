const { connection } = require("./Config/db");
const express = require("express");
const cors = require("cors");
const UserRouter = require("./routes/Users");
const PostRouter = require("./routes/Posts");

const app = express();
app.use(express.json());


app.use(cors({ origin: "*" }));

app.use("/", UserRouter);
app.use("/", PostRouter);

app.get("/", (req, res) => {
  res.send("Home");
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
