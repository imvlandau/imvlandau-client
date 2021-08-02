import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./PmbLogo.scss";

function PmbLogo({ rotating, inverted, hidden, className, size }) {
  return (
    <svg
      className={clsx(
        "pmb-logo",
        rotating && "rotating",
        inverted && "inverted",
        hidden && "hidden",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 0 19.1 19.1"
    >
      <g className="cls-1">
        <title>playmobox logo</title>
        <g className="pmb-logo-x-shape">
          <g className="cls-2">
            <path
              className="cls-3"
              d="M3.6,18.6a0.5,0.5,0,0,1-.5-0.5v-1a0.5,0.5,0,0,1,.15-0.35l6-6a0.5,0.5,0,0,1,.71,0l6,6a0.5,0.5,0,0,1,.15.35v1a0.5,0.5,0,0,1-.5.5H3.6Z"
            />
            <path d="M9.6,11.1l6,6v1H3.6v-1l6-6m0-1a1,1,0,0,0-.71.29l-6,6a1,1,0,0,0-.29.71v1a1,1,0,0,0,1,1h12a1,1,0,0,0,1-1v-1a1,1,0,0,0-.29-0.71l-6-6A1,1,0,0,0,9.6,10.1h0Z" />
          </g>
          <path
            className="cls-4"
            d="M3.5,18.5A0.5,0.5,0,0,1,3,18V17a0.5,0.5,0,0,1,.15-0.35l6-6a0.5,0.5,0,0,1,.71,0l6,6A0.5,0.5,0,0,1,16,17v1a0.5,0.5,0,0,1-.5.5H3.5Z"
          />
          <path
            className="cls-5"
            d="M9.5,11l6,6v1H3.5V17l6-6m0-1a1,1,0,0,0-.71.29l-6,6A1,1,0,0,0,2.5,17v1a1,1,0,0,0,1,1h12a1,1,0,0,0,1-1V17a1,1,0,0,0-.29-0.71l-6-6A1,1,0,0,0,9.5,10h0Z"
          />
        </g>
        <g className="pmb-logo-x-shape">
          <g className="cls-2">
            <path
              className="cls-3"
              d="M17.1,16.1A0.5,0.5,0,0,1,16.75,16l-6-6a0.5,0.5,0,0,1,0-.71l6-6A0.5,0.5,0,0,1,17.1,3.1h1a0.5,0.5,0,0,1,.5.5v12a0.5,0.5,0,0,1-.5.5h-1Z"
            />
            <path d="M18.1,3.6v12h-1l-6-6,6-6h1m0-1h-1a1,1,0,0,0-.71.29l-6,6a1,1,0,0,0,0,1.41l6,6a1,1,0,0,0,.71.29h1a1,1,0,0,0,1-1V3.6a1,1,0,0,0-1-1h0Z" />
          </g>
          <path
            className="cls-4"
            d="M17,16a0.5,0.5,0,0,1-.35-0.15l-6-6a0.5,0.5,0,0,1,0-.71l6-6A0.5,0.5,0,0,1,17,3h1a0.5,0.5,0,0,1,.5.5v12a0.5,0.5,0,0,1-.5.5H17Z"
          />
          <path
            className="cls-5"
            d="M18,3.5v12H17l-6-6,6-6h1m0-1H17a1,1,0,0,0-.71.29l-6,6a1,1,0,0,0,0,1.41l6,6a1,1,0,0,0,.71.29h1a1,1,0,0,0,1-1V3.5a1,1,0,0,0-1-1h0Z"
          />
        </g>
        <g className="pmb-logo-x-shape">
          <g className="cls-2">
            <path
              className="cls-3"
              d="M9.6,8.6a0.5,0.5,0,0,1-.35-0.15l-6-6A0.5,0.5,0,0,1,3.1,2.1v-1A0.5,0.5,0,0,1,3.6.6h12a0.5,0.5,0,0,1,.5.5v1a0.5,0.5,0,0,1-.15.35l-6,6A0.5,0.5,0,0,1,9.6,8.6Z"
            />
            <path d="M15.6,1.1v1l-6,6-6-6v-1h12m0-1H3.6a1,1,0,0,0-1,1v1a1,1,0,0,0,.29.71l6,6a1,1,0,0,0,1.41,0l6-6A1,1,0,0,0,16.6,2.1v-1a1,1,0,0,0-1-1h0Z" />
          </g>
          <path
            className="cls-4"
            d="M9.5,8.5a0.5,0.5,0,0,1-.35-0.15l-6-6A0.5,0.5,0,0,1,3,2V1A0.5,0.5,0,0,1,3.5.5h12A0.5,0.5,0,0,1,16,1V2a0.5,0.5,0,0,1-.15.35l-6,6A0.5,0.5,0,0,1,9.5,8.5Z"
          />
          <path
            className="cls-5"
            d="M15.5,1V2l-6,6-6-6V1h12m0-1H3.5a1,1,0,0,0-1,1V2a1,1,0,0,0,.29.71l6,6a1,1,0,0,0,1.41,0l6-6A1,1,0,0,0,16.5,2V1a1,1,0,0,0-1-1h0Z"
          />
        </g>
        <g className="pmb-logo-x-shape">
          <g className="cls-2">
            <path
              className="cls-3"
              d="M1.1,16.1a0.5,0.5,0,0,1-.5-0.5V3.6a0.5,0.5,0,0,1,.5-0.5h1a0.5,0.5,0,0,1,.35.15l6,6a0.5,0.5,0,0,1,0,.71l-6,6a0.5,0.5,0,0,1-.35.15h-1Z"
            />
            <path d="M2.1,3.6l6,6-6,6h-1V3.6h1m0-1h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h1a1,1,0,0,0,.71-0.29l6-6a1,1,0,0,0,0-1.41l-6-6A1,1,0,0,0,2.1,2.6h0Z" />
          </g>
          <path
            className="cls-4"
            d="M1,16a0.5,0.5,0,0,1-.5-0.5V3.5A0.5,0.5,0,0,1,1,3H2a0.5,0.5,0,0,1,.35.15l6,6a0.5,0.5,0,0,1,0,.71l-6,6A0.5,0.5,0,0,1,2,16H1Z"
          />
          <path
            className="cls-5"
            d="M2,3.5l6,6-6,6H1V3.5H2m0-1H1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1H2a1,1,0,0,0,.71-0.29l6-6a1,1,0,0,0,0-1.41l-6-6A1,1,0,0,0,2,2.5H2Z"
          />
        </g>
      </g>
    </svg>
  );
}

PmbLogo.defaultProps = {
  size: 20,
  hidden: false,
  inverted: false,
  rotating: false
};

PmbLogo.propTypes = {
  size: PropTypes.number,
  hidden: PropTypes.bool,
  inverted: PropTypes.bool,
  rotating: PropTypes.bool
};

export default PmbLogo;
