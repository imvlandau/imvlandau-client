"use strict";

const path = require("path");
const fs = require("fs-extra");

module.exports = function(basePath, languages, namespaces) {
  const data = {};
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

      availableNamespaces.forEach(ns => {
        var filepath = path.join(languagePath, `${ns}.json`);
        if (fs.pathExistsSync(filepath)) {
          var content = fs.readJsonSync(filepath, { throws: false });
          if (content) data[language][ns] = content;
        }
      });
    } else {
      targetNamespaces.forEach(ns => {
        data[language][ns] = {};
      });
    }
  });

  return data;
};
