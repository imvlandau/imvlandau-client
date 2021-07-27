import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import EventListener from "react-event-listener";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function PmbSnackbar({ options, notifications, ...props }) {
  const classes = useStyles();
  const didMountRef = React.useRef(false);

  const handleCloseAll = () => {
    toast.dismiss();
  };

  const handleKeyDown = event => {
    // on pressing the escape key
    if (event.which === 27 || event.keyCode === 27) {
      handleCloseAll();
    }
  };

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
      <EventListener onKeyDown={handleKeyDown} target="window" />
      <ToastContainer
        {...options}
        className={classes.root}
        bodyClassName={classes.body}
        toastClassName={classes.toast}
      />
    </React.Fragment>
  );
}

PmbSnackbar.defaultProps = {
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

PmbSnackbar.propTypes = {
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

export default connect(mapStateToProps)(PmbSnackbar);
