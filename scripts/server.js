const express = require("express");
const proxy = require("http-proxy-middleware");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const paths = require("../config/paths");
const i18next = require("../config/imv-i18next-resource-bundler");
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

app.use(helmet());

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
  console.log("[IMV] Requested URL:", new Date().toLocaleString(), req.url);
  const data = i18next(paths.appPublicLocales, req.params.lng, req.params.ns);
  res.end(JSON.stringify(data));
});

// Handle React routing, return all requests to code editor
app.get("/edit/*", function(req, res) {
  console.log("[IMV] Requested URL for /edit/*:", req.url);
  res.sendFile(path.join(paths.appBuild, "index.html"));
});

// Handle React routing, return all requests to landing page
app.get("/*", function(req, res) {
  console.log(
    "[IMV] Requested URL for /*:",
    new Date().toLocaleString(),
    req.url
  );
  res.sendFile(path.join(paths.appBuild, "index.html"));
});

http.createServer(app).listen(process.env.PORT || 80);
process.env.HTTPS === "true" &&
  https.createServer(sslOptions, app).listen(process.env.PORT_SSL || 443);
