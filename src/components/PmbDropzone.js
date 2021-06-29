import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { DropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import Typography from "@material-ui/core/Typography";
import { FaUpload } from "react-icons/fa";
import { initialState } from "../views/editor";
import { formatBytes, uid } from "../helpers/utils";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    zIndex: 1
  },
  dropzoneOverlay: {
    background: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: "center",
    color: theme.palette.common.black,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1201
  },
  uploadIcon: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main
  },
  dropContainer: {
    background: theme.palette.grey[200],
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: "4px",
    width: "50vw",
    height: "50vh",
    maxWidth: theme.breakpoints.values.sm,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
}));

const fileTarget = {
  drop(props, monitor, component) {
    const dndItem = monitor.getItem();
    dndItem &&
      dndItem.dirContent.then(data => {
        let files = [];
        Array.from(data).forEach(file => {
          file.uid = uid();
          files.push(file);
        });
        props.onDrop && props.onDrop(files);
      });
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

function PmbDropzone({ connectDropTarget, isOver, canDrop, children }) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);

  return connectDropTarget(
    <div className={classes.root}>
      {isOver && canDrop && (
        <div className={classes.dropzoneOverlay}>
          <div className={classes.dropContainer}>
            <FaUpload className={classes.uploadIcon} />
            <Typography color="inherit" variant="h5" paragraph gutterBottom>
              {t("heading.drop.here.to.upload")}
            </Typography>
            <Typography color="inherit" variant="body1" paragraph gutterBottom>
              {t(
                "subheading.drop.here.to.upload"
              )}
            </Typography>
            <Typography color="inherit" variant="caption">
              {t("caption.drop.here.to.upload") +
                ": " +
                formatBytes(initialState.uploadMaxFileSize)}
            </Typography>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

PmbDropzone.propTypes = {
  onDrop: PropTypes.func
};

export default DropTarget(NativeTypes.FILE, fileTarget, collect)(PmbDropzone);
