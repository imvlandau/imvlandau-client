import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useEventListener from "../../services/useEventListener";

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    maxWidth: "33vw",
    [theme.breakpoints.down('sm')]: {
      width: "94.5vw",
      maxWidth: "none"
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: "66vw"
    }
  },
  body: {
    maxHeight: "93vh",
    overflow: "auto",
    marginRight: theme.spacing(1)
  },
  toast: {
    cursor: "auto"
  }
}));

const CloseButton = ({ className, closeToast, ...props }) => (
  <Button
    type="button"
    variant="outlined"
    onClick={closeToast}
    className={className}
    color='inherit'
  >
    Close
  </Button>
);

function Notifications({ options, notifications, ...props }) {
  const classes = useStyles();
  const didMountRef = React.useRef(false);

  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const handleKeyDown = useCallback(
    ({ which, keyCode }) => {
      // on pressing the escape key
      if (which === 27 || keyCode === 27) {
        toast.dismiss();
      }
    },
    []
  );
  useEventListener("keydown", handleKeyDown);

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    } else {
      for (let notification of notifications) {
        toast.dismiss(notification.toastId);
      }

      for (let notification of notifications) {
        toast(notification.message, {
          closeButton: <CloseButton />,
          toastId: notification.toastId,
          type: notification.type,
          autoClose:
            notification.autoClose !== undefined
              ? notification.autoClose
              : options.autoClose
        });
      }
    }
  }, [notifications, options]);

  return (
    <React.Fragment>
      <ToastContainer
        {...options}
        className={classes.root}
        bodyClassName={classes.body}
        toastClassName={classes.toast}
      />
    </React.Fragment>
  );
}

Notifications.defaultProps = {
  options: {
    position: "top-right",
    autoClose: false,
    newestOnTop: false,
    closeOnClick: false,
    rtl: false,
    pauseOnVisibilityChange: true,
    draggable: false
  }
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["default", "success", "info", "warning", "error"])
        .isRequired,
      toastId: PropTypes.number.isRequired
    })
  )
};

const mapStateToProps = (state, ownProps) => ({
  notifications: state.notifications.notifications
});

export default connect(mapStateToProps)(Notifications);
