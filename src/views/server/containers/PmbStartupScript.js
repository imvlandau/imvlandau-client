/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: theme.spacing(2)
  },
  loader: {
    marginRight: theme.spacing(1)
  },
  selectField: {
    marginBottom: theme.spacing(1)
  },
  textField: {
    marginBottom: theme.spacing(1),
    "& span": {
      display: "block",
      marginBottom: theme.spacing(1)
    }
  },
  formLabel: {
    marginBottom: theme.spacing(1)
  }
}));

function PmbStartupScript({
  processingStartupScripts,
  startupScripts: startupScriptsProps = [],
  notifications,
  onChangeSelect,
  onChangeValue,
  onChangeContent,
  onCreate,
  selected: selectedProps = null,
  value: valueProps = "",
  content: contentProps = "",
  ...props
}) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);
  const [startupScripts, setStartupScripts] = React.useState(
    startupScriptsProps
  );
  const [selected, setSelected] = React.useState(selectedProps);
  const [value, setValue] = React.useState(valueProps);
  const [content, setContent] = React.useState(contentProps);
  const errorsInValueField = notifications.filter(
    notification => notification.key.indexOf("startup_script.name") > -1
  );
  const errorsInContentField = notifications.filter(
    notification => notification.key.indexOf("startup_script.content") > -1
  );

  const handleChangeSelect = event => {
    event.preventDefault();
    let found = startupScripts.find(item => item.id === event.target.value);
    setSelected(found || null);
    onChangeSelect && onChangeSelect(found || null);
  };

  const handleChangeValue = event => {
    event.preventDefault();
    setValue(event.target.value);
    onChangeValue && onChangeValue();
  };

  const handleChangeContent = event => {
    event.preventDefault();
    setContent(event.target.value);
    onChangeContent && onChangeContent();
  };

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    } else {
      // updated
      setStartupScripts(startupScriptsProps);
      setSelected(selectedProps);
      setValue(valueProps);
      setContent(contentProps);
    }
  }, [startupScriptsProps, selectedProps, valueProps, contentProps]);

  return processingStartupScripts ? (
    <div className={classes.loaderContainer}>
      <CircularProgress className={classes.loader} color="secondary" />
      <Typography component="h6">
        {t("caption.processing.startup.scripts")}
      </Typography>
    </div>
  ) : (
    <React.Fragment>
      <FormControl fullWidth variant="filled" className={classes.selectField}>
        <InputLabel id="pmb-key-pair-select-field-label">
          {t("label.select.startup.script")}
        </InputLabel>
        <Select
          labelId="pmb-key-pair-select-field-label"
          id="pmb-key-pair-select-field"
          value={(selected && selected.id) || ""}
          onChange={handleChangeSelect}
        >
          <MenuItem value="">
            <em>{t("caption.nothing.selected")}</em>
          </MenuItem>
          {startupScripts.map((keyPair, index) => (
            <MenuItem key={index} value={keyPair.id}>
              {keyPair.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        error={Boolean(errorsInValueField.length)}
        className={classes.textField}
        label={t("label.enter.startup.script.name")}
        placeholder={t("placeholder.enter.startup.script.name")}
        fullWidth
        value={value}
        onChange={handleChangeValue}
        helperText={
          errorsInValueField.length
            ? errorsInValueField.map((notification, index) => (
                <span key={index}>- {notification.message}</span>
              ))
            : null
        }
        variant="filled"
      />
      <TextField
        error={Boolean(errorsInContentField.length)}
        className={classes.textField}
        fullWidth
        id="startup-script"
        label="Startup script"
        multiline
        rows="14"
        value={content || ""}
        onChange={handleChangeContent}
        helperText={
          errorsInContentField.length
            ? errorsInContentField.map((notification, index) => (
                <span key={index}>- {notification.message}</span>
              ))
            : null
        }
        variant="filled"
      />
      {!processingStartupScripts ? (
        <Button
          variant="outlined"
          color="secondary"
          disabled={!value || !content}
          fullWidth
          onClick={() => onCreate && onCreate(value, content)}
          size="large"
          startIcon={<AddIcon />}
        >
          {t("button.create.startup.script")}
        </Button>
      ) : null}
    </React.Fragment>
  );
}

PmbStartupScript.propTypes = {
  startupScripts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeSelect: PropTypes.func,
  onChangeValue: PropTypes.func,
  onChangeContent: PropTypes.func,
  onCreate: PropTypes.func,
  selected: PropTypes.object,
  value: PropTypes.string,
  content: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
  processingStartupScripts: state.server.processingStartupScripts,
  notifications: state.toastr.notifications
});

export default connect(mapStateToProps)(PmbStartupScript);
