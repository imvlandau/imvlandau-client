import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
  const { t } = useTranslation();
  return (
    <Box justifyContent="center" textAlign="center" p={4} {...otherProps}>
      {showDivider && <hr className={classes.divider} />}
      <Typography variant="caption">
        Copyright by IMV-Landau e. V.  © All rights reserved -&nbsp;
        <Link to="/legal-note" className={classes.link}>
          {t("link.legal.note")}
        </Link>
      </Typography>
    </Box>
  );
}

PmbFooter.propTypes = {
  showDivider: PropTypes.bool
};

export default PmbFooter;
