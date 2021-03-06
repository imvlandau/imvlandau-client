const createProxyMiddleware = require("http-proxy-middleware");
const i18next = require("../config/imv-i18next-resource-bundler");
const paths = require("../config/paths");

require("dotenv").config({ path: '.env.local' });


// this is used just in mode: NODE_ENV === "development"
module.exports = function(app) {
  app.use("/api",
    createProxyMiddleware({
      target: process.env.API_TARGET,
      changeOrigin: true,
    })
  );
  app.get("/locales/:lng/:ns.json", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    console.log("[PMB] Requested URL:", new Date().toLocaleString(), req.url);
    const data = i18next(paths.appSrcLocales, req.params.lng, req.params.ns);
    res.end(JSON.stringify(data));
  });
};
