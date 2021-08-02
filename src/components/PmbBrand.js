import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import PmbLogo from "./PmbLogo";

const useStyles = makeStyles(theme => ({
  link: {
    fontStyle: "italic",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    lineHeight: "1.4em",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(13)
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.pxToRem(14)
    },
    textDecoration: "none",
    fontWeight: "lighter",
    color: "inherit",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginRight: theme.spacing(1),
    paddingRight: theme.spacing(1 / 4)
  },
  symbol: {
    marginRight: theme.spacing(1 / 4)
  }
}));

function PmbBrand({ rotating }) {
  const classes = useStyles();
  return (
    <Typography color="inherit" variant="h6">
      <a className={classes.link} href={"/"}>
        <PmbLogo
          className={classes.symbol}
          inverted={true}
          rotating={rotating}
          size={15}
        />
        playmobox
      </a>
    </Typography>
  );
}

PmbBrand.defaultProps = {
  rotating: false
};

PmbBrand.propTypes = {
  rotating: PropTypes.bool
};

export default PmbBrand;
