const ioServer = require("socket.io");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const paths = require("../config/paths");

require("dotenv").config();

const sslOptions = process.env.HTTPS === "true" && {
  cert: fs.readFileSync(
    process.env.SSL_CERT_FILE || path.join(paths.appCerts, "server.crt"),
    "utf8"
  ),
  key: fs.readFileSync(
    process.env.SSL_CERT_KEY_FILE || path.join(paths.appCerts, "server.key"),
    "utf8"
  )
};

const server =
  process.env.HTTPS === "true"
    ? https
        .createServer(sslOptions)
        .listen(process.env.SYNCHRONIZER_PORT_SSL || 4433)
    : http
        .createServer()
        .listen(process.env.SYNCHRONIZER_PORT || 4444);

const io = ioServer(server, {
  path: "/synchronizer",
  transports: ["websocket", "polling"]
});

io.on("connection", function(socket) {
  var room = socket.handshake["query"]["shortid"];
  socket.join(room);

  socket.on("disconnect", function() {
    socket.leave(room);
  });

  // ======================= boxTree
  // ===========================================================================

  socket.on("createFile", function(data) {
    socket.to(room).emit("createFile", data);
  });
  socket.on("createDirectory", function(data) {
    socket.to(room).emit("createDirectory", data);
  });

  socket.on("deleteFile", function(data) {
    socket.to(room).emit("deleteFile", data);
  });
  socket.on("deleteDirectory", function(data) {
    socket.to(room).emit("deleteDirectory", data);
  });
  socket.on("deleteChildren", function(data) {
    socket.to(room).emit("deleteChildren", data);
  });

  socket.on("duplicateFile", function(data) {
    socket.to(room).emit("duplicateFile", data);
  });
  socket.on("duplicateDirectory", function(data) {
    socket.to(room).emit("duplicateDirectory", data);
  });

  socket.on("renameFile", function(data) {
    socket.to(room).emit("renameFile", data);
  });
  socket.on("renameDirectory", function(data) {
    socket.to(room).emit("renameDirectory", data);
  });

  socket.on("moveFile", function(data) {
    socket.to(room).emit("moveFile", data);
  });
  socket.on("moveDirectory", function(data) {
    socket.to(room).emit("moveDirectory", data);
  });

  socket.on("updateContent", function(data) {
    socket.to(room).emit("updateContent", data);
  });

  socket.on("uploadFiles", function(data) {
    socket.to(room).emit("uploadFiles", data);
  });
});
