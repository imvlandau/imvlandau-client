import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { DIRECTORY, FILE } from "../helpers/utils";

function PmbTreeNodeNameDialog({
  dialogContentText: dialogContentTextProps,
  dialogTitle: dialogTitleProps,
  label: labelProps,
  node,
  onClose,
  onSubmit,
  type,
  value: valueProp = ""
}) {
  const { t } = useTranslation(["editor"]);
  const [value, setValue] = React.useState("");
  const nameDialogInputRef = React.useRef(null);
  let dialogTitle, dialogContentText, label;

  function handleEntering() {
    if (nameDialogInputRef.current != null) {
      nameDialogInputRef.current.focus();
    }
    if (valueProp !== value) {
      setValue(valueProp);
    }
  }

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(value);
  }

  if (type === FILE) {
    dialogContentText =
      dialogContentTextProps || t("caption.enter.filename");
    dialogTitle = dialogTitleProps || t("heading.create.file");
    label = labelProps || dialogTitle;
  } else if (type === DIRECTORY) {
    dialogContentText =
      dialogContentTextProps || t("caption.enter.foldername");
    dialogTitle = dialogTitleProps || t("heading.create.folder");
    label = labelProps || dialogTitle;
  } else {
    dialogContentText =
      dialogContentTextProps ||
      t("caption.enter.name.for.file.or.folder");
    dialogTitle = dialogTitleProps || t("heading.create.file.or.folder");
    label = labelProps || dialogTitle;
  }

  return (
    <Dialog
      aria-labelledby="name-dialog-title"
      maxWidth="sm"
      onClose={onClose}
      onEntering={handleEntering}
      open={Boolean(node)}
    >
      <DialogTitle id="name-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContentText}</DialogContentText>
        <DialogContentText variant="overline">
          {t("caption.invalid.charackters.are")}{t(" ")}
          <br />
          <Typography variant="overline" component="code" color="error">
            {t("caption.invalid.charackters")}
          </Typography>
        </DialogContentText>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            aria-label="Name for file or folder"
            value={value}
            autoFocus
            fullWidth
            id="name"
            label="Name"
            margin="dense"
            onChange={handleChange}
            ref={nameDialogInputRef}
            type="text"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t("button.cancel")}
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {label}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PmbTreeNodeNameDialog.propTypes = {
  dialogContentText: PropTypes.string,
  dialogTitle: PropTypes.string,
  label: PropTypes.string,
  node: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  type: PropTypes.oneOf([FILE, DIRECTORY]),
  value: PropTypes.string
};

export default PmbTreeNodeNameDialog;
