import React from "react";
import PropTypes from "prop-types";
import availableFlags from "./lib/CountryCodes";
import countries from "world-countries/countries.json";
import find from "lodash.find";

function PmbFlag({
  alt,
  basePath,
  className,
  country,
  format,
  height,
  name,
  pngSize,
  shiny,
  width
}) {
  // Get information about a country using the alpha-3 ISO code.
  const cca3To2 = cca3 => {
    let country = find(countries, { cca3: cca3 });
    return country ? country.cca2 : "_unknown";
  };

  const countryToConvert = name || country;

  const convertedCountry =
    countryToConvert.length === 3
      ? cca3To2(countryToConvert)
      : countryToConvert;

  const type = shiny ? "shiny" : "flat";

  const folder = format === "icns" || format === "ico" ? format : pngSize;

  const altText = alt || convertedCountry;

  const file =
    convertedCountry.charAt(0) === "_"
      ? convertedCountry
      : convertedCountry.toUpperCase();

  const flag = ~availableFlags.flags.indexOf(file) ? file : "_unknown";

  const src = `${basePath}/flags-iso/${type}/${folder}/${flag}.${format}`;

  return (
    <img
      alt={altText}
      className={className}
      height={height}
      src={src}
      width={width}
    />
  );
}

PmbFlag.defaultProps = {
  alt: null,
  basePath: "/images/flags",
  className: "",
  country: "_unknown",
  format: "png",
  height: null,
  name: null,
  pngSize: 32,
  shiny: false,
  width: null
};

PmbFlag.propTypes = {
  // Alternative text of the flag <img> HTML tag.
  alt: PropTypes.string,
  // Base path to the content of /vendor
  basePath: PropTypes.string,
  // Image className
  className: PropTypes.string,
  // Country or region for this flag. (Legacy)
  country: PropTypes.string,
  // File format of the flag.
  format: PropTypes.oneOf(["png", "icns", "ico"]),
  // Height of the flag <img> HTML tag.
  height: PropTypes.number,
  // Name of country or region for this flag. (Legacy)
  name: PropTypes.string,
  // Size of the PNG country flag
  pngSize: PropTypes.oneOf([16, 24, 32, 48, 64]),
  // Shiny or Flat
  shiny: PropTypes.bool,
  // Width of the flag <img> HTML tag.
  width: PropTypes.number
};

export default PmbFlag;
