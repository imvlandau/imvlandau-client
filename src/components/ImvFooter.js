import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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

function ImvFooter({ showDivider = false, ...otherProps }) {
  const classes = useStyles();
  return (
    <Box justifyContent="center" textAlign="center" p={4} {...otherProps}>
      {showDivider && <hr className={classes.divider} />}
      <Typography variant="caption">
        Copyright by IMV-Landau e. V.  © All rights reserved
      </Typography>
    </Box>
  );
}

ImvFooter.propTypes = {
  showDivider: PropTypes.bool
};

export default ImvFooter;
