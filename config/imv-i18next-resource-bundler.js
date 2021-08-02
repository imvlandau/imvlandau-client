"use strict";

const path = require("path");
const fs = require("fs-extra");

module.exports = function(basePath, languages, namespaces) {
  let data = {};
  const targetLanguages = languages.split("+");
  const targetNamespaces = namespaces.split("+");
  const findNamespacesByLanguage = languagePath =>
    fs
      .readdirSync(languagePath)
      .filter(
        entry => !fs.statSync(path.join(languagePath, entry)).isDirectory()
      )
      .map(file => file.split(".json")[0]);
  targetLanguages.forEach(language => {
    data[language] = {};
    const languagePath = path.join(basePath, language);
    if (fs.existsSync(languagePath)) {
      const foundNamespaces = findNamespacesByLanguage(languagePath);
      const availableNamespaces = foundNamespaces.filter(
        ns => targetNamespaces.indexOf(ns) > -1
      );

      availableNamespaces.some(ns => {
        var filepath = path.join(languagePath, `${ns}.json`);
        if (fs.pathExistsSync(filepath)) {
          data = fs.readJsonSync(filepath, { throws: false });
          return data;
        }
      });
    } else {
      targetNamespaces.forEach(ns => {
        data = {};
      });
    }
  });
  return data;
};
