import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import { isFile, isDirectory } from "../helpers/utils";

const useStyles = makeStyles(theme => ({
  fileIcon: {
    color: theme.palette.primary.main
  }
}));

function PmbDeleteDialog({
  node,
  dialogContentText: dialogContentTextProps,
  icon: iconProps,
  label: labelProps,
  onClose,
  onSubmit,
  type: typeProps
}) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);
  let dialogContentText, type, label, icon;

  if (!Boolean(node)) {
    return null;
  }

  if (isFile(node)) {
    dialogContentText =
      dialogContentTextProps ||
      t("caption.delete.target.file");
    icon = iconProps || <FileIcon classes={{ root: classes.fileIcon }} />;
    label = labelProps || t("heading.delete.target.file");
    type = typeProps || t("caption.entry.type.file");
  } else if (isDirectory(node)) {
    dialogContentText =
      dialogContentTextProps ||
      t("caption.delete.target.folder");
    icon = iconProps || <FolderIcon />;
    label = labelProps || t("heading.delete.target.folder");
    type = typeProps || t("caption.entry.type.folder");
  }

  return (
    <Dialog
      aria-describedby="delete-dialog-description"
      aria-labelledby="delete-dialog-title"
      onClose={onClose}
      open={Boolean(node)}
    >
      <DialogTitle id="delete-dialog-title">{label}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description" paragraph>
          {dialogContentText}
        </DialogContentText>
        <Box fontSize="caption.fontSize" fontWeight="fontWeightLight">
          {t("label.name")}
        </Box>
        <Box
          fontFamily="Monospace"
          fontSize="h6.fontSize"
          fontWeight="fontWeightMedium"
          mb={2}
        >
          {node.name}
        </Box>
        <Box fontSize="caption.fontSize" fontWeight="fontWeightLight">
          {t("label.path")}
        </Box>
        <Box
          fontFamily="Monospace"
          fontSize="h6.fontSize"
          fontWeight="fontWeightMedium"
          mb={2}
        >
          {node.pathname}
        </Box>
        <Box fontSize="caption.fontSize" fontWeight="fontWeightLight">
          {t("label.type")}
        </Box>
        <Box
          alignItems="center"
          display="flex"
          fontFamily="Monospace"
          fontSize="h6.fontSize"
          fontWeight="fontWeightMedium"
          mb={2}
        >
          {icon}
          {type}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={onClose}>
          {t("button.cancel")}
        </Button>
        <Button color="primary" onClick={onSubmit}>
          {label}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PmbDeleteDialog.defaultProps = {
  dialogContentText: "",
  node: null,
  icon: null,
  label: "",
  type: ""
};

PmbDeleteDialog.propTypes = {
  dialogContentText: PropTypes.string,
  node: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  type: PropTypes.string
};

export default PmbDeleteDialog;
