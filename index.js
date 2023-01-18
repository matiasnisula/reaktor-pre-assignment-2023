const http = require("http");
const path = require("path");
const fs = require("fs");

const STATIC_PATH = path.join(process.cwd(), "./build");

const server = http.createServer(async (request, response) => {
  const { url } = request;
  const paths = [STATIC_PATH, url];

  try {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");

    console.log("req.url:", url);
    response.on("error", (error) => {
      console.log("ERROR:", error);
    });
    if (request.url === "/") {
      paths.push("index.html");
    }
    const filePath = path.join(...paths);
    console.log("filePath:", filePath);
    response.statusCode = 200;
    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    console.log(error);
    response.statusCode = 404;
    response.end();
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT);
console.log(`Server running on port ${PORT}`);
