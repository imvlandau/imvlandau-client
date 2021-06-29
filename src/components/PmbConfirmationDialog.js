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

const useStyles = makeStyles(theme => ({
  fileIcon: {
    color: theme.palette.primary.main
  }
}));

function PmbConfirmationDialog({
  node,
  dialogContentText: dialogContentTextProps,
  label: labelProps,
  onClose,
  onSubmit
}) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);
  let dialogContentText, label;

  if (!Boolean(node)) {
    return null;
  }

  dialogContentText = dialogContentTextProps || t("caption.submit.changes");
  label = labelProps || t("heading.update.content");

  return (
    <Dialog
      aria-describedby="delete-dialog-description"
      aria-labelledby="delete-dialog-title"
      onClose={onClose}
      open={Boolean(node)}
    >
      <DialogTitle id="update-content-title">{label}</DialogTitle>
      <DialogContent>
        <DialogContentText id="update-content-description" paragraph>
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

PmbConfirmationDialog.defaultProps = {
  dialogContentText: "",
  node: null,
  label: ""
};

PmbConfirmationDialog.propTypes = {
  dialogContentText: PropTypes.string,
  node: PropTypes.object,
  label: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

export default PmbConfirmationDialog;
