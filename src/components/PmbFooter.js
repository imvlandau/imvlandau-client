import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  divider: {
    border: 0,
    height: "1px",
    backgroundImage:
      "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.4), transparent)",
    marginBottom: theme.spacing(4)
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main
  }
}));

function PmbFooter({ showDivider = false, ...otherProps }) {
  const classes = useStyles();
  return (
    <Box justifyContent="center" textAlign="center" p={4} {...otherProps}>
      {showDivider && <hr className={classes.divider} />}
      <Typography variant="caption">
        Copyright by Playmobox © All rights reserved
      </Typography>
    </Box>
  );
}

PmbFooter.propTypes = {
  showDivider: PropTypes.bool
};

export default PmbFooter;
