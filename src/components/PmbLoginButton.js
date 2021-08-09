import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth0 } from "../reactAuth0Spa";

const useStyles = makeStyles(theme => ({
  button: {
    fontStyle: "italic",
    padding: theme.spacing(1, 2),
    lineHeight: 1.5
  },
  icon: {
    width: "1.2rem",
    height: "1.2rem"
  },
  loader: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(0.5)
  }
}));

function PmbLoginButton({
  iconLogin,
  iconLogout,
  labelLoading,
  labelLogin,
  labelLogout,
  tReady,
  ...otherProps
}) {
  const classes = useStyles();
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();

  return loading ? (
    <Button classes={{ root: classes.button }} color="inherit" {...otherProps}>
      <CircularProgress
        className={classes.loader}
        color="primary"
        size={24}
        thickness={4}
      />
      {labelLoading}
    </Button>
  ) : !isAuthenticated ? (
    <Button
      classes={{ root: classes.button }}
      color="inherit"
      {...otherProps}
      onClick={() => loginWithRedirect({})}
    >
      {iconLogin(classes.icon)}
      {labelLogin}
    </Button>
  ) : (
    <Button
      classes={{ root: classes.button }}
      color="inherit"
      {...otherProps}
      onClick={() => logout()}
    >
      {iconLogout(classes.icon)}
      {labelLogout}
    </Button>
  );
}

PmbLoginButton.defaultProps = {
  iconLogin: className => <PersonIcon className={className} />,
  iconLogout: className => <MeetingRoomIcon className={className} />
};

PmbLoginButton.propTypes = {
  iconLogin: PropTypes.func,
  iconLogout: PropTypes.func,
  labelLoading: PropTypes.string.isRequired,
  labelLogin: PropTypes.string.isRequired,
  labelLogout: PropTypes.string.isRequired
};

export default PmbLoginButton;
