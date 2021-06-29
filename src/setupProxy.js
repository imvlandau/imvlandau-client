const proxy = require("http-proxy-middleware");
const i18next = require("../config/pmb-i18next-resource-bundler");
const paths = require("../config/paths");

require("dotenv").config();

const apiOptions =
  process.env.HTTPS === "true"
    ? { target: `${process.env.API_TARGET || "http://playmobox-api:80/"}` }
    : {
        target: `${process.env.API_TARGET_SSL || "https://playmobox-api:443/"}`,
        secure: false, // verify the SSL Certs
        protocolRewrite: "https"
      };

const synchronizerOptions =
  process.env.HTTPS === "true"
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

// this is used just in mode: NODE_ENV === "development"
module.exports = function(app) {
  app.use(proxy("/api", apiOptions));
  app.use(proxy("/synchronizer", synchronizerOptions));
  app.get("/locales/:lng/:ns.json", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    console.log("[PMB] Requested URL:", new Date().toLocaleString(), req.url);
    const data = i18next(paths.appSrcLocales, req.params.lng, req.params.ns);
    res.end(JSON.stringify(data));
  });
};
