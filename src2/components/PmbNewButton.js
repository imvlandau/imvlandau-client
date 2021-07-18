import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(theme => ({
  button: {
    fontStyle: "italic",
    padding: theme.spacing(1, 2),
    lineHeight: 1.5
  },
  icon: {
    width: "1.2rem",
    height: "1.2rem"
  }
}));

function PmbNewButton({ icon, label, tReady, ...otherProps }) {
  const classes = useStyles();

  return (
    <Button classes={{ root: classes.button }} color="inherit" {...otherProps}>
      {label}
      {icon(classes.icon)}
    </Button>
  );
}

PmbNewButton.defaultProps = {
  icon: className => <AddIcon className={className} />
};

PmbNewButton.propTypes = {
  icon: PropTypes.func,
  label: PropTypes.string.isRequired
};

export default PmbNewButton;
