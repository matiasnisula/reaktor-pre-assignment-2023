const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const {
  violatedPilots,
  fetchAndUpdatePilots,
  setIsUpdated,
  getIsUpdated,
  getClosestDistance,
} = require("./services/pilots");

const STATIC_PATH = path.join(process.cwd(), "./build");

let intervalID = null;

const sendPilots = async () => {
  await fetchAndUpdatePilots();
  if (getIsUpdated()) {
    console.log("sending pilots..");
    io.sockets.emit("pilotUpdate", JSON.stringify(Array.from(violatedPilots)));
    io.sockets.emit("closestDistance", Math.floor(getClosestDistance()));
    setIsUpdated(false);
  }
};

const clearIntervalIfNoSocketsConnected = async () => {
  const sockets = await io.fetchSockets();
  if (sockets === undefined || sockets.length === 0) {
    clearInterval(intervalID);
    intervalID = null;
  }
};

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

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["OPTIONS", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  if (!intervalID) {
    intervalID = setInterval(sendPilots, 2000);
  }
  socket.on("disconnect", async () => {
    await clearIntervalIfNoSocketsConnected();
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT);
console.log(`Server running on port ${PORT}`);
