const express = require("express");
const postBank = require("./postBank");
const app = express();
const morgan = require("morgan");
var timeAgo = require("node-time-ago");
const postList = require("./views/postList");
const postDetails = require("./views/postDetails");
const { default: htmlTemplateTag } = require("html-template-tag");
const chalk = require("chalk");
const client = require("./db");

app.use(morgan("dev"));

// app.get("/", (req, res) => res.send("Hello World!"));

app.use(express.static(__dirname + "/public")); // photo files

const baseQuery =
  "SELECT posts.*, users.name, counting.upvotes FROM posts INNER JOIN users ON users.id = posts.userId INNER JOIN (SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId) AS counting ON posts.id = counting.postId\n";

app.get("/", async (req, res) => {
  try {
    const data = await client.query(baseQuery); // gets post info
    res.send(postList(data.rows));
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error}`);
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const data = await client.query(baseQuery + "WHERE posts.id = $1", [
      req.params.id,
    ]);
    res.send(postDetails(data.rows[0]));
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error}`);
  }
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(chalk.blueBright(`Listening at http://localhost:${PORT}`));
});
