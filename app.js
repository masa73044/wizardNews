const express = require("express");
const postBank = require("./postBank");
const app = express();
const morgan = require("morgan");
var timeAgo = require("node-time-ago");

app.use(morgan("dev"));

// app.get("/", (req, res) => res.send("Hello World!"));

app.use(express.static("public")); // photo files

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, just throw an error
    throw new Error("Not Found");
  } else {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <p class="news-item">
        <a href="/posts/${post.id}">${post.title}</a>
        <small>(by ${post.name})</small>
        
      </p>
      <p class="news-item">${post.content}</p>
      <br>
      <small class="news-info">
          ${post.upvotes} upvotes | ${timeAgo(post.date)}
        </small>
    </div>
  </body>
</html>`);
  }
});

// app.get("/posts/:id", (req, res) => {
//   const id = req.params.id;

//   const post = postBank.find(id);
//   res.send(`<!DOCTYPE html>
//   <html>
//   <head>
//     <title>Wizard News</title>

//     <link rel="stylesheet" href="/style.css" />
//   </head>
//   <body>
//     <div class="news-list">
//       <header><img src="/logo.png"/>Wizard News</header>
//       <p class="news-item">
//         <a href="/posts/${post.id}">${post.title}</a>
//         <small>(by ${post.name})</small>

//       </p>
//       <p class="news-item">${post.content}</p>
//       <br>
//       <small class="news-info">
//           ${post.upvotes} upvotes | ${post.date}
//         </small>
//     </div>
//   </body>
// </html>`);
// });

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲
            </span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${timeAgo(post.date)}
          </small>
          
        </div>
        `
        )
        .join("")}
    </div>
  </body>
</html>`;
  res.send(html);
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
