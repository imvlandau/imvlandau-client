import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PmbLogo from "./PmbLogo";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: props => props.position || "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: "rgba(0, 0, 100, 0.2)",
    transition: theme.transitions.create("opacity", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    }),
    zIndex: 1600
  },
  symbol: {
    marginBottom: theme.spacing(3)
  },
  title: {
    color: theme.palette.common.white,
    textShadow: `
    1px 1px 1px ${theme.palette.secondary.dark},
    1px -1px 1px ${theme.palette.secondary.dark},
    -1px 1px 1px ${theme.palette.secondary.dark},
    -1px -1px 1px ${theme.palette.secondary.dark}`
  }
}));

function PmbOverlay({
  size = 104,
  title = "",
  variant = "h2",
  position = "fixed",
  rotating = true
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PmbLogo
        inverted={false}
        rotating={rotating}
        size={size}
        className={classes.symbol}
      />
      {title ? (
        <Typography variant={variant} className={classes.title}>
          {title}
        </Typography>
      ) : null}
    </div>
  );
}

PmbOverlay.propTypes = {
  position: PropTypes.string
};

export default PmbOverlay;
