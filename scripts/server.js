const express = require("express");
const proxy = require("http-proxy-middleware");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const paths = require("../config/paths");
const i18next = require("../config/pmb-i18next-resource-bundler");
const buildFolder = path.relative(process.cwd(), paths.appBuild);

require("dotenv").config();

const app = express();

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

const synchronizerOptions =
  process.env.NODE_ENV === "production"
    ? {
        target: `${process.env.SYNCHRONIZER_TARGET_SSL ||
          "wss://localhost:4433/synchronizer/"}`,
        ssl: sslOptions,
        secure: true, // verify the SSL Certs
        ws: true
      }
    : process.env.HTTPS === "true"
    ? {
        target: `${process.env.SYNCHRONIZER_TARGET_SSL ||
          "wss://localhost:4433/synchronizer/"}`,
        secure: false, // verify the SSL Certs
        ws: true
      }
    : {
        target: `${process.env.SYNCHRONIZER_TARGET ||
          "ws://localhost:4444/synchronizer/"}`,
        ws: true
      };

app.use(helmet());

// Pass Websocket-Requests to synchronizer
app.use(proxy("/synchronizer", synchronizerOptions));

// Pass API-Requests to backend
app.use(
  proxy("/api", {
    target: `${process.env.API_TARGET || "http://localhost:3333/"}`,
    protocolRewrite: "https"
  })
);

// Serve any static files
app.use(express.static(buildFolder));

app.get("/locales/:lng/:ns.json", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  console.log("[PMB] Requested URL:", new Date().toLocaleString(), req.url);
  const data = i18next(paths.appPublicLocales, req.params.lng, req.params.ns);
  res.end(JSON.stringify(data));
});

// Handle React routing, return all requests to code editor
app.get("/edit/*", function(req, res) {
  console.log("[PMB] Requested URL for /edit/*:", req.url);
  res.sendFile(path.join(paths.appBuild, "index.html"));
});

// Handle React routing, return all requests to landing page
app.get("/*", function(req, res) {
  console.log(
    "[PMB] Requested URL for /*:",
    new Date().toLocaleString(),
    req.url
  );
  res.sendFile(path.join(paths.appBuild, "index.html"));
});

http.createServer(app).listen(process.env.PORT || 80);
process.env.HTTPS === "true" &&
  https.createServer(sslOptions, app).listen(process.env.PORT_SSL || 443);
